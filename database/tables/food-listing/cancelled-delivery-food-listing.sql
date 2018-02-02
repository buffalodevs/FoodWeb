-- Keeps records of all cancelled Deliveries.
-- Should only be cancelled if the deliverer cannot make the drive, or if the food has gone bad / not handled properly.

--DROP TABLE CancelledDeliveryFoodListing CASCADE; 
CREATE TABLE IF NOT EXISTS CancelledDeliveryFoodListing
(
    cancelledDeliveryFoodListingKey SERIAL PRIMARY KEY
);

-- Key of Delivery Food Listing that is to be Cancelled.
ALTER TABLE CancelledDeliveryFoodListing ADD COLUMN IF NOT EXISTS deliveryFoodListingKey    INTEGER     NOT NULL REFERENCES DeliveryFoodListing (deliveryFoodListingKey);

-- Key of the App User who cancelled the Delivery.
ALTER TABLE CancelledDeliveryFoodListing ADD COLUMN IF NOT EXISTS cancelledByAppUserKey     INTEGER     NOT NULL REFERENCES AppUser (appUserKey);

-- The reason for the cancellation (should be required by front-end interface).
ALTER TABLE CancelledDeliveryFoodListing ADD COLUMN IF NOT EXISTS cancelReason              TEXT        NOT NULL;

-- Timestapm of the cancellation.
ALTER TABLE CancelledDeliveryFoodListing ADD COLUMN IF NOT EXISTS cancelTime                TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP;


-- Add more columns here --

CREATE INDEX IF NOT EXISTS cancelledDeliveryFoodListing_DeliveryFoodListingKeyIdx   ON CancelledDeliveryFoodListing (deliveryFoodListingKey);
CREATE INDEX IF NOT EXISTS cancelledDeliveryFoodListing_CancelledByAppUserKeyIdx    ON CancelledDeliveryFoodListing (cancelledByAppUserKey);

-- Create more indexes here --