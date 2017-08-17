import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';

import { DonorPrimaryService } from "./donor-primary.service";
import { DateFormatterPipe } from "../common-util/date-formatter.pipe"
import { FoodListing } from "../../../../shared/food-listings/food-listing";

@Component({
    moduleId: module.id,
    selector: 'donor',
    templateUrl: 'donor.component.html',
    providers: [DonorPrimaryService],
    styleUrls: ['donor.component.css']
})
export class DonorComponent implements OnInit {
    foodForm: FormGroup;
    perishableOptions: string[];
    foodTypeOptions: string[];
    forceValidation: boolean;
    submitted: boolean;
    dispUrl: string;

    image: string;
    cropperSettings: CropperSettings;

    constructor(
        private formBuilder: FormBuilder,
        private donorPrimaryService: DonorPrimaryService,
        private element: ElementRef,
        private dateFormatter: DateFormatterPipe
    ) {
        // Want to force validators to process on submit. Non-text fields will only validate on submit too!
        this.forceValidation = false;
        this.submitted = false;

        this.cropperSettings = new CropperSettings();
        this.cropperSettings.width = 100;
        this.cropperSettings.height = 100;
        this.cropperSettings.croppedWidth = 100;
        this.cropperSettings.croppedHeight = 100;
        this.cropperSettings.canvasWidth = 400;
        this.cropperSettings.canvasHeight = 300;

        this.perishableOptions = ['Perishable', 'Not Perishable'];
        this.foodTypeOptions = ['Grain', 'Meat', 'Fruit', 'Vegetable', 'Drink'];
    }

    ngOnInit() {
        this.foodForm = this.formBuilder.group({
            foodType: ['', Validators.required],
            perishable: [''],
            foodDescription: ['', Validators.required],
            expirationDate: ['', Validators.required]
        });
    }

    shouldFireRequireValidation(validField: AbstractControl): boolean {
        return validField.errors != null && validField.errors.required && (validField.touched || this.forceValidation);
    }

    onSubmit({ value, valid }: { value: FoodListing, valid: boolean }) {
        this.forceValidation = true;

        // Checkbox when unchecked resolves to empty string, so explicitely set it to false if not given the value of true from the form!
        if (value.perishable != true) {
            value.perishable = false;
        }

        if (valid) {
            let observer = this.donorPrimaryService.addFoodListing(value, this.image);
            observer.subscribe(
                (foodListingKey: number) => {
                    // TODO: Add functionality for edit of added food listing using the returned key!
                    this.submitted = true;
                },
                (err: Error) => {
                    console.log(err);
                }
            );
        }
    }
}
