SELECT dropFunction ('updateAvailability');

/**
 * Updates the availability times for a given App User. It will completely overwrite old availability times (given that they exist).
 */
CREATE OR REPLACE FUNCTION updateAvailability
(
    _appUserKey     AppUserAvailability.appUserKey%TYPE,
    -- @ts-sql class="TimeRange" file="/shared/app-user/time-range.ts"
    _timeRanges     JSON[]
)
RETURNS VOID
AS $$
    DECLARE _startTime  AppUserAvailability.startTime%TYPE;
    DECLARE _endTime    AppUserAvailability.endTime%TYPE;
BEGIN

    -- First delete all current availability entries for the given App User.
    DELETE FROM AppUserAvailability
    WHERE       appUserKey = _appUserKey;


    -- Loop through all time ranges in _timeRanges argument, and add them into AppUserAvailability.
    FOR i IN array_lower(_timeRanges, 1) .. array_upper(_timeRanges, 1)
    LOOP

        -- Convert time in TEXT format to time in TIMESTAMP format.
        _startTime := TO_TIMESTAMP(_timeRanges[i]->>'startTime', 'MM/DD/YYYY hh12:mi AM');
        _endTime := TO_TIMESTAMP(_timeRanges[i]->>'endTime', 'MM/DD/YYYY hh12:mi AM');

        -- Perform the insert.
        INSERT INTO AppUserAvailability (appUserKey, startTime, endTime)
        VALUES      (_appUserKey, _startTime, _endTime);

    END LOOP;
    
END;
$$ LANGUAGE plpgsql;


/*
SELECT * FROM updateAvailability( 1, array[JSON_BUILD_OBJECT('startTime', '11/12/2017 10:00 AM', 'endTime', '11/12/2017 1:00 PM')] );

SELECT  AppUser.email,
        appUserAvailability.startTime,
        appUserAvailability.endTime
FROM AppUser
INNER JOIN AppUserAvailability ON AppUser.appUserKey = AppUserAvailability.appUserKey;
*/
