import { Component, Input } from '@angular/core';


@Component({
    selector: 'app-slick-left-panel',
    templateUrl: './slick-left-panel.component.html',
    styleUrls: ['./slick-left-panel.component.css']
})
export class SlickLeftPanelComponent {

    /**
     * The title of the toggle button. Will show in the tooltip tab for the button on hover.
     */
    @Input() private buttonTitle: string;
    /**
     * Determines whether or not a back drop will be used when the panel is toggled to visible in mobile mode. Default is true.
     */
    @Input() private useBackDrop: boolean;


    public constructor() {
        this.buttonTitle = 'toggle';
        this.useBackDrop = true;
    }


    /**
     * Called whenever the slickLeftPanelButton is pressed. Handles the toggling of the slickLeftPanel when in mobile mode.
     * @param slickLeftPanel The slickLeftPanel (div) element which will be toggled in or out of the viewport.
     * @param slickLeftPanelButton The slickLeftPanelButton (button) element which was pressed.
     */
    private togglePanelVisibility(slickLeftPanel: HTMLElement, slickLeftPanelButton: HTMLElement, backDrop: HTMLElement): void {

        // If our slickLeftPanel div is outside the viewport, and we are translating it into the viewport
        if (!this.isPanelToggledIntoView(slickLeftPanel)) {
            this.toggleIntoView(slickLeftPanel, slickLeftPanelButton, backDrop);
        }
        // Else if our slickLeftPanel div is inside the viewport, and we are translating it out of the viewport (getting rid of translation).
        else {
            this.toggleOutOfView(slickLeftPanel, slickLeftPanelButton, backDrop);
        }
    }


    /**
     * Determines if the slick left panel is toggled into the viewport.
     * @param slickLeftPanel The slick left panel (div) element.
     */
    private isPanelToggledIntoView(slickLeftPanel: HTMLElement): boolean {
        // If it is in view, then there will be a translation value!
        return slickLeftPanel.classList.contains('toggle-into-view');
    }


    /**
     * Toggles the slickLeftPanel into the viewport.
     * @param slickLeftPanel The slickLeftPanel (div) element which will be toggled into the viewport.
     * @param slickLeftPanelButton The slickLeftPanelButton (button) element which was pressed.
     */
    private toggleIntoView(slickLeftPanel: HTMLElement, slickLeftPanelButton: HTMLElement, backDrop: HTMLElement): void {
        // The toggle-into-view css class contains the translation.
        slickLeftPanel.classList.add('toggle-into-view');
        slickLeftPanelButton.classList.remove('green-glow');
        slickLeftPanelButton.style.right = '0px';
        if (this.useBackDrop)   backDrop.classList.add('show-back-drop');
        else                    backDrop.classList.add('show-transparent-back-drop');
        backDrop.onclick = this.toggleOutOfView.bind(this, slickLeftPanel, slickLeftPanelButton, backDrop);
    }


    /**
     * Toggles the slickLeftPanel out of the viewport.
     * @param slickLeftPanel The slickLeftPanel (div) element which will be toggled out of the viewport.
     * @param slickLeftPanelButton The slickLeftPanelButton (button) element which was pressed.
     */
    private toggleOutOfView(slickLeftPanel: HTMLElement, slickLeftPanelButton: HTMLElement, backDrop: HTMLElement): void {
        window.onclick = null;
        slickLeftPanel.classList.remove('toggle-into-view');
        //slickLeftPanelButton.classList.add('green-glow');
        backDrop.classList.remove('show-back-drop');
        backDrop.classList.remove('show-transparent-back-drop');
        slickLeftPanelButton.style.right = '-' + slickLeftPanelButton.offsetWidth + 'px';
    }


    /**
     * Handles a scroll event to determine when to fix the slickLeftPanel div to the top of the viewport. We will fix it when
     * we scroll to or past the top of the slickLeftPanel div. We will unfix it when we scroll above this position once more.
     * @param event The scroll event.
     */
    /*private monitorScrollForStickyTop(event: Event): void {
        let slickLeftPanel: HTMLElement = document.getElementById('slick-left-panel'); // This can potentially get out of sync with template if id changes!
        let fixCutoff: number = this.getAbsolutePosTop(slickLeftPanel.parentElement);
        let scrollPosition: number = (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);

        if (scrollPosition >= fixCutoff) {
            slickLeftPanel.style.position = 'fixed';
            slickLeftPanel.style.top = '0px';
        }
        else {
            slickLeftPanel.style.position = 'absolute';
            slickLeftPanel.style.top = 'auto';
        }
    }*/


    /**
     * Calculates the absolute position of the top of a given HTML element.
     * @param element The element to get the absolute position of.
     */
    /*private getAbsolutePosTop(element): number {
        let top: number = 0;

        do {
            top += element.offsetTop || 0;
            element = element.offsetParent;
        } while (element);

        return top;
    }*/
}