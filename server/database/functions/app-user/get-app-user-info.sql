--This will be called by the 'getAppUserInfo' ts function,
--and it will collect and return all the necessary DATA
SELECT dropFunction('getAppUserInfo');

CREATE OR REPLACE FUNCTION getAppUserInfo
(
    _appUserKey         INTEGER         DEFAULT NULL,
    _email              VARCHAR(128)    DEFAULT NULL,
    _lastName           VARCHAR(60)     DEFAULT NULL,
    _firstName          VARCHAR(60)     DEFAULT NULL,
    _organizationName   VARCHAR(128)    DEFAULT NULL
)
RETURNS SETOF AppUserInfoAggregate
AS $$
BEGIN

    RETURN QUERY
    SELECT  AppUser.appUserKey, 
            AppUser.email,
            AppUserPassword.password,
            AppUser.lastName,
            AppUser.firstName,
            Organization.name,
            ContactInfo.address,
            ContactInfo.city,
            ContactInfo.state,
            ContactInfo.zip,
            ContactInfo.addressLatitude,
            ContactInfo.addressLongitude,
            ContactInfo.phone,
            AppUser.isDonor,
            AppUser.isReceiver,
            (UnverifiedAppUser.appUserKey IS NULL),
            UnverifiedAppUser.verificationToken
    FROM AppUser
    INNER JOIN AppUserPassword      ON AppUser.appUserKey = AppUserPassword.appUserKey
    INNER JOIN ContactInfo          ON AppUser.appUserKey = ContactInfo.appUserKey
    LEFT JOIN  Organization         ON AppUser.appUserKey = Organization.appUserKey
    LEFT JOIN  UnverifiedAppUser    ON AppUser.appUserKey = UnverifiedAppUser.appUserKey
    WHERE (_appUserKey IS NULL       OR AppUser.appUserKey = _appUserKey)
      AND (_email IS NULL            OR AppUser.email = _email)
      AND (_lastName IS NULL         OR AppUser.lastName = _lastName)
      AND (_firstName IS NULL        OR AppUser.firstName = _firstName)
      AND (_organizationName IS NULL OR Organization.name = _organizationName)
      AND (AppUserPassword.appUserPasswordKey = ( SELECT    appUserPasswordKey
                                                  FROM      AppUserPassword AppUserPasswordDate
                                                  WHERE     AppUserPasswordDate.appUserKey = AppUser.appUserKey
                                                  ORDER BY  AppUserPasswordDate.createDate DESC
                                                  LIMIT     1 ));

END;
$$ LANGUAGE plpgsql;

--SELECT * FROM getAppUserInfo(NULL, 'marknemm@buffalo.edu');
