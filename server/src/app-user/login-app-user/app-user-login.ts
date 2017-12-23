'use strict';
import { logSqlConnect, logSqlQueryExec, logSqlQueryResult } from '../../logging/sql-logger';
import { connect, query, Client, QueryResult } from '../../database-util/connection-pool';
import { checkPassword } from '../common-app-user/password-util';
import { SessionData, AppUserInfo } from "../../common-util/session-data";

import { TimeRange } from '../../../../shared/app-user/time-range';
import { AppUserErrorMsgs} from '../../../../shared/app-user/app-user-error-msgs';


/**
 * Performs the login for a given user.
 * @param email The email (username) of the user.
 * @param password The (plain text) password of the user.
 * @return A promise where on success it will provide the primary AppUser information of the logged in user.
 */
export function login(email: string, password: string): Promise<SessionData> {

    return getAppUserInfo(email)
        .then((getAppUserInfoResult: QueryResult) => {
            return analyzeGetAppUserInfoResult(email, password, getAppUserInfoResult);
        })
        .catch((err: Error) => {
            console.log(err);
            // Return general login error message so that we do not give away any sensitive details to potential hacker.
            return Promise.reject(new Error(AppUserErrorMsgs.INCORRECT_LOGIN));
        });
}


/**
 * Gets the primary info for a given App User.
 * @param email: The email (username) of the user to get the salt for.
 * @return A promise with the query result. The query result should simply contain one row information pertaining to the App User.
 */
function getAppUserInfo(email: string): Promise<QueryResult> {

    let queryString: string = `SELECT * FROM getAppUserSessionData(NULL, $1, TRUE);`;
    let queryArgs: Array<string> = [email];

    logSqlQueryExec(queryString, queryArgs);
    return query(queryString, queryArgs);
}


/**
 * Anyalyzes the result of getting the App User's primary info. If the App User does exist, then we will check the password and bring back all organizations
 * associated with the given App User if the password is correct.
 * @param email The email (username) of the user that the password is being hashed for.
 * @param password The plain text password that is to be hashed.
 * @param getAppUserInfoResult The query result that on success should contain a single row with the App User info.
 * @return A promise that on success will resolve to the app user's session data for login.
 */
function analyzeGetAppUserInfoResult(email: string, password: string, getAppUserInfoResult: QueryResult): Promise<SessionData> {

    logSqlQueryResult(getAppUserInfoResult.rows);

    // We should only be getting one row back with the app user data!
    if (getAppUserInfoResult.rowCount === 1) {

        let firstRowResult: any = getAppUserInfoResult.rows[0];
        let hashPassword: string = firstRowResult.password;
        
        return checkPassword(password, hashPassword)
            .then((isMatch: boolean) => {

                if (isMatch) {
                    return <SessionData>(firstRowResult.sessiondata);
                }

                throw new Error('Password is incorrect');
            });
    }

    // Otherwise, we could not find an AppUser with username or email in database.
    throw new Error('AppUser could not be found with email: ' + email);
}
