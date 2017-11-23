import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';

import { CommonUtilModule } from '../common-util/common-util.module';
import { AngularMaterialWrapperModule } from '../angular-material-wrapper/angular-material-wrapper.module';
import { SlickFilteredListModule } from '../slick-filtered-list/slick-filtered-list.module';
import { SlickMapModule } from '../slick-map/slick-map.module';

import { DeliveryFoodListingsComponent } from './delivery-food-listings/delivery-food-listings.component';
import { DeliveryFoodListingsFiltersComponent } from './delivery-food-listings/delivery-food-listings-filters/delivery-food-listings-filters.component';
import { DeliveryFoodListingDialogComponent } from './delivery-food-listings/delivery-food-listing-dialog/delivery-food-listing-dialog.component';
import { DeliverComponent } from './deliver/deliver.component';

import { RoutePreprocessService } from '../common-util/services/route-preprocess.service';
import { VehicleTypesService } from '../domain/vehicle-types/vehicle-types.service';
import { GetDeliveryFoodListingsService } from './delivery-food-listings/delivery-food-listing-services/get-delivery-food-listings.service';
import { DeliveryFoodListingUtilService } from './delivery-food-listings/delivery-food-listing-services/delivery-food-listing-util.service';


const delivererRoutes: Routes = [
    {
        path: 'deliver',
        component: DeliverComponent,
        canActivate: [RoutePreprocessService],
        // Make sure that we get the VehicleTypes from the back end before routing to the delivery interface!
        resolve: {
            vehicleTypes: VehicleTypesService
        }
    }
];


@NgModule({
    declarations: [
        DeliveryFoodListingsComponent,
        DeliveryFoodListingsFiltersComponent,
        DeliveryFoodListingDialogComponent,
        DeliverComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(delivererRoutes),
        FormsModule,
        ReactiveFormsModule,
        AgmCoreModule,
        AngularMaterialWrapperModule,
        CommonUtilModule,
        SlickFilteredListModule,
        SlickMapModule
    ],
    providers: [
        GetDeliveryFoodListingsService,
        DeliveryFoodListingUtilService
    ]
})
export class DelivererModule { }