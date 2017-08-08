import { NextFunction, Request, Response } from 'express';
import { addFoodListing } from './add-food-listing';
import { getFoodListing } from './get-food-listings';
import { fetchAppUserKey } from './fetch-app-user-key';
import { FoodListing } from './food-listing';
import { claimFoodListing } from './claim-food-listing';

export function handleAddFoodListingRequest(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');

    var foodListing: FoodListing = new FoodListing(
        request.session['appUserKey'],
        request.body.foodType,
        request.body.perishable,
        request.body.foodDescription,
        request.body.expirationDate,
        request.body.image,
        null // The model will generate the image name and fill this for now!
    );

    var promise = addFoodListing(foodListing);
    promise.then(function () {
        response.send({ success: true, message: 'Food listing added successfully' });
    })
        .catch(function () {
            response.send({ success: false, message: 'Error: food listing add failed' });
        });
}

export function handleReceiverGetFoodListingsRequest(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');
    var promise = getFoodListing(request.body, null);
    promise.then((searchResult: Array<object>) => {
        response.send(JSON.stringify(searchResult));
    })
        .catch((err: Error) => {
            response.send(JSON.stringify([]))
        })
}

export function handleReceiverCartGetFoodListingsRequest(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');
    let requestedByAppUserKey: number = fetchAppUserKey(request.session);
    if (requestedByAppUserKey == -1) {
        response.send(new Error("You need to Log in"));
    }
    else {
        var promise = getFoodListing(request.body, requestedByAppUserKey);
        promise.then((searchResult: Array<object>) => {
            response.send(JSON.stringify(searchResult));
        })
            .catch((err: Error) => {
                response.send(JSON.stringify([]))
            })
    }
}

export function handleClaimFoodListingRequest(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');
    var promise = claimFoodListing(request.body);
    promise.then((claimResult: Boolean) => {
        response.send({ success: true, message: "FoodListing has been successfully claimed" });
    })
        .catch((err: Error) => {
            response.send({ success: false, message: err.message });
        })
}
