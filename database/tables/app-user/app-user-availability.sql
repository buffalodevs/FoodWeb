-- Holds availability (schedule) data for each user. Determines when each user is available for pickup (donor) and/or delivery (receiver).

--DROP TABLE AppUserAvailability CASCADE;
CREATE TABLE IF NOT EXISTS AppUserAvailability
(
    appUserAvailabilityKey SERIAL PRIMARY KEY
);

-- Many to one relationship between AppUserAvailability and AppUser respectively.
ALTER TABLE AppUserAvailability ADD COLUMN IF NOT EXISTS appUserKey     INTEGER     NOT NULL REFERENCES AppUser (appUserKey);

-- Holds times relative to the week of 11/12/2017 for regular availability (condensed weekday time combos in form of timestamps).
ALTER TABLE AppUserAvailability ADD COLUMN IF NOT EXISTS startTime      TIMESTAMP   NOT NULL;
ALTER TABLE AppUserAvailability ADD COLUMN IF NOT EXISTS endTime        TIMESTAMP   NOT NULL;


CREATE INDEX IF NOT EXISTS appUserAvailability_appUserKeyIdx    ON AppUserAvailability (appUserKey);
CREATE INDEX IF NOT EXISTS appUserAvailability_startTimeIdx     ON AppUserAvailability (startTime);
CREATE INDEX IF NOT EXISTS appUserAvailability_endTimeIdx       ON AppUserAvailability (endTime);