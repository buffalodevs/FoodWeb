import { OnInit } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { GetListingsService } from './get-listings.service';
import { SlickListFilters } from './slick-list-message/slick-list-request';
import { AbstractSlickListDialog } from "./slick-list-dialog/abstract-slick-list-dialog";


/**
 * Base class for all lists that display Iflitered) data queried from server. Holds generic functionality for refreshing the list and appending to it when scroll to bottom.
 * Also, holds some generic functionality for interaction between list and a details dialog for each item of the list.
 */
export abstract class AbstractSlickList <LIST_T, FILTERS_T extends SlickListFilters> implements OnInit {

    /**
     * The data held by this list.
     */
    protected listData: Array<LIST_T>;
    /**
     * The index of the selected list item.
     */
    protected selectedListIndex: number;

    /**
     * The dialog associated with this list. Should be shadowed by child class so that list interaction with dialog is automatically handled in this base class.
     */
    protected slickListDialog: AbstractSlickListDialog <LIST_T>;
    private showProgressSpinner: boolean;


    /**
     * A constructor that should only be accessed by child classes. This class is an abstract base class that should not be directly instantiated!
     * @param getListingsService The service used to get listings from the server (Can either be GetListingsService or a derived class).
     * @param ROUTE The route that will be used to fetch list data.
     */
    protected constructor (
        private getListingsService: GetListingsService<LIST_T, FILTERS_T>,
        private readonly ROUTE: string
    ) {
        // Initialize instance variables.
        this.listData = new Array<LIST_T>();
        this.selectedListIndex = null;
        this.showProgressSpinner = false;

        // Setup callback (listener) for the retrieval of more listings.
        this.getListingsService.onGetMoreListings(this.onGetMoreListings.bind(this));
    }


    public ngOnInit(): void {

        // Listen to removeListing event in dialog child (if child exists).
        if (this.slickListDialog != null) {
            this.slickListDialog.removeListing.subscribe(this.removeSelectedListing.bind(this));
        }
    }


    /**
     * Callback that is invoked by getListingsService whenever it has retrieved more listings due to scrolling near bottom of web page.
     * @param moreListings The additional listings that have been retrieved.
     */
    private onGetMoreListings(moreListings: Array<LIST_T>): void {
        this.onReceivedListData(moreListings);
        this.listData = this.listData.concat(moreListings);
    }


    /**
     * Refreshes the listings using the new set of filters criteria. The offset used to retreive a certain range of listings will be reset to 0.
     * @param filters The filter criteria. 
     */
    public refreshList(filters: FILTERS_T): void {

        let observer: Observable<Array<LIST_T>> = this.getListingsService.getListings(filters, this.ROUTE);
        this.showProgressSpinner = true;
        this.listData = new Array<LIST_T>(); // Empty our current model list while we wait for server results.

        observer.finally(() => { this.showProgressSpinner = false; })
                .subscribe((listData: Array<LIST_T>) => {
                    this.onReceivedListData(listData);
                    this.listData = listData;
                });
    }


    /**
     * Invoked whenever list data has been received.
     * This is invoked before the data is displayed.
     * @param listData The list data that has been received.
     */
    protected onReceivedListData(listData: Array<LIST_T>): void {
        // Child class can override this to manipulate data before it is displayed.
    }


    /**
     * Determines whether or not the progress spinner should be shown.
     * @return true if it should be shown, false if not.
     */
    public shouldShowProgressSpinner(): boolean {
        return this.showProgressSpinner;
    }


    /**
     * Sets a given list item as selected and displays a set dialog if there is one.
     * @param selectedListIndex The index of the list item to select.
     * @param displayDialog Default is true. Set to false if the set dialog should not be displayed upon selection.
     */
    public selectListing(selectedListIndex: number, displayDialog: boolean = true): void {

        this.selectedListIndex = selectedListIndex;

        // If we wish to display the dialog and we have one set, then open it.
        if (displayDialog && this.slickListDialog != null) {
            this.slickListDialog.open(this.getSelectedListing());
        }
    }


    /**
     * Gets the selected listing.
     * @return The selected listing data.
     */
    public getSelectedListing(): LIST_T {

        if (this.selectedListIndex != null) {
            return this.listData[this.selectedListIndex];
        }
        return null;
    }


    /**
     * Removes the selected listing.
     * @param closeDialog Default is true. Determines whether or not to also close any open dialog.
     */
    public removeSelectedListing(closeDialog: boolean = true): void {

        // Close any modal details popup related to the listing we are deleting.
        if (closeDialog && this.slickListDialog != null && this.slickListDialog.isOpen()) {
            this.slickListDialog.close();
        }
        
        // Remove the listing from the contained array model.
        this.listData.splice(this.selectedListIndex, 1);
        this.selectedListIndex = null;
    }
}
