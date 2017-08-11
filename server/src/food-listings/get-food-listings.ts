'use strict'
import { connect, query, Client, QueryResult } from '../database_help/connection_pool';
import { fixNullQueryArgs } from '../database_help/prepared-statement-helper';
import { logSqlConnect, logSqlQueryExec, logSqlQueryResult } from '../logging/sql_logger';
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
//filterByMyAppUser;

export function getFoodListing(foodObject, requesetedByAppUserKey: number, organizationKey: number): Promise<Array<object>> {
    var perishableArg: boolean = generatePerishabilityArg(foodObject.perishable, foodObject.notPerishable);
    var foodTypesArg: string = generateFoodTypesArg(foodObject.foodTypes);
    var expireDateArg: string = generateExpireDateArg(foodObject.minExpireAfterDays);
    var queryArgs: Array<any> = new Array<any>();
   
    // Build our prepared statement.
    var queryString: string = 'SELECT * FROM getFoodListings(null, $1, $2, null, $3, $4);';
    queryArgs = [ foodTypesArg, perishableArg, expireDateArg, requesetedByAppUserKey ];
    queryString = fixNullQueryArgs(queryString, queryArgs);

    // Log and execute query.
    logSqlQueryExec(queryString, queryArgs);

    return query(queryString, queryArgs)
    .then((queryResult: QueryResult) => {
        // Generate result array and return it.
        logSqlQueryResult(queryResult.rows);
        let resultArray: Array<object> = generateResultArray(queryResult.rows);
        return Promise.resolve(resultArray);
    })
    .catch((err: Error) => {
        console.log(err);
        return Promise.reject(new Error('Food listing search failed'));
    });
}

function generatePerishabilityArg(perishable: boolean, notPerishable: boolean): boolean {
    // If exactly one filter is only active, then we apply filter.
    var notBoth = !(perishable && notPerishable);
    var notNeither = (perishable || notPerishable);
    if (notBoth && notNeither) {
        return perishable;
    }
    return null;
}

function generateFoodTypesArg(foodTypes: string[]): string {
    let foodTypesArg: string = null;

    if (foodTypes != null && foodTypes.length > 0) {
        foodTypesArg = '{ ';

        for (let i: number = 0; i < foodTypes.length; i++) {
            foodTypesArg += foodTypes[i] + ', ';
        }

        foodTypesArg = foodTypesArg.substr(0, foodTypesArg.length - 2) + " }";
    }

    return foodTypesArg;
}

function generateExpireDateArg(minExpireAfterDays: NgbDateStruct): string {
    return (minExpireAfterDays.month + '/' + minExpireAfterDays.day + '/' + minExpireAfterDays.year);
}

function generateResultArray(rows: Array<any>): Array<object> {
    let result: Array<object> = [];

    for (let i: number = 0; i < rows.length; i++) {
        result.push({
            foodListingKey: rows[i].foodlistingkey,
            foodTypeDescription: rows[i].foodtypedescription,
            foodDescription: rows[i].fooddescription,
            perishable: rows[i].perishable,
            donorOrganizationName: rows[i].donororganizationname,
            donorOrganizationAddress: rows[i].donororganizationaddress,
            donorOrganizationCity: rows[i].donororganizationcity,
            donorOrganizationState: rows[i].donororganizationstate,
            donorOrganizationZip: rows[i].donororganizationzip,
            donorLastName: rows[i].donorlastname,
            donorFirstName: rows[i].donorfirstname,
            expirationDate: rows[i].expiredate,
            imgUrl: rows[i].imgurl             
        });
    }

    return result;
}