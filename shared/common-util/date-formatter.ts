import * as moment from "moment";
import { Validation } from "./validation";


class WallClockTime {

    public constructor (
        public hours?: number,
        public minutes?: number,
        public amOrPm?: string
    ) {}


    /**
     * Gets the wall clock time hours [0, 12] in millitary time hours [0, 23].
     * @return The wall clock time hours in millitary time scale.
     */
    public getMillitaryHours(): number {
        return (this.amOrPm.toUpperCase() === 'AM') ? this.hours + ( (this.hours === 12) ? -12 : 0)
                                                    : this.hours + ( (this.hours === 12) ? 0 : 12 );
    }
}


export class DateFormatter {


    // Pure static class!
    private constructor() {}


    /**
     * Ensures that the input 'Date' object is in fact a date object and not a string representation.
     * This is necessary since TypeScript does not have runtime type checking, and when a date object is put in JSON format,
     * then it is converted into its string equivalent.
     * @param date Object to check if type is date (will be converted to Date if not and is convertable).
     * @return A date object equivalent to the input.
     */
    public static ensureIsDate(date: Date): Date {
        
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        return date;
    }


    /**
     * Gets the string format (MM/DD/YYYY) of a given date.
     * @param date The date to get the string format of.
     * @return The string format of the input date.
     */
    public static dateToMonthDayYearString(date: Date): string {

        if (date != null) {
            // Check to see if we are in fact passed a Date object (may have been stringified in JSON response)!
            date = DateFormatter.ensureIsDate(date);

            return ( (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() );
        }

        return '';
    }


    /**
     * Gets the wall clock time string (hh:mm ['AM' | 'PM']) for a given date.
     * @param date The date to get the wall clock time string from.
     * @param discardSeconds Set to false if seconds should be included. Default is true for discard seconds.
     * @return The wall clock time string for the given date.
     */
    public static dateToWallClockString(date: Date, discardSeconds: boolean = true): string {

        let wallClockString: string = '';

        if (date != null) {
            
            // Check to see if we are in fact passed a Date object (may have been stringified in JSON response)!
            date = DateFormatter.ensureIsDate(date);

            wallClockString = date.toLocaleTimeString();

            if (discardSeconds) {
                let localTimeStringSplits: string[] = wallClockString.split(/:\d{2} /);
                wallClockString = (localTimeStringSplits[0] + ' ' + localTimeStringSplits[1]);
            }
        }

        return wallClockString;
    }


    /**
     * Gets the wall clock hours [1, 12] from a given date.
     * @param date The date to get the wall clock hours from.
     * @return The wall clock hours from the given date.
     */
    public static getWallClockHours(date: Date): number {

        if (date != null) {

            date = DateFormatter.ensureIsDate(date);

            const millitaryHours: number = date.getHours();
            return (millitaryHours > 12) ? (millitaryHours - 12)
                                         : millitaryHours;
        }

        return null;
    }


    /**
     * Determines whether or not the date has AM or PM wall clock time.
     * @param date The date from which to determine AM or PM from.
     * @return An AM or PM string based on the given date.
     */
    public static getWallClockAmOrPm(date: Date): string {

        if (date != null) {

            date = DateFormatter.ensureIsDate(date);

            return (date.getHours() > 12) ? 'PM'
                                          : 'AM';
        }

        return '';
    }


    /**
     * Sets the wall clock time for a given date based on a given wall clock time string (hh:mm ['AM' | 'PM']).
     * @param date The date to set the time of.
     * @param time The time string of format: /^([1-9]|1[0-2]):[0-5]\d(\s?)[AaPp][Mm]$/.
     * @return The input date with its time set. If an invalid time string is provided, then null is returned!
     */
    public static setWallClockTimeForDate(date: Date, time: string): Date {

        if (!DateFormatter.isWallClockFormat(time))  return null;

        let timeDate: Date = new Date(date.valueOf());
        let wallClockTime: WallClockTime = DateFormatter.parseWallClockTime(time);

        timeDate.setHours(wallClockTime.getMillitaryHours(), wallClockTime.minutes, 0, 0);        
        return timeDate;
    }


    /**
     * Checks if a given string is in a proper wall clock format: /^([1-9]|1[0-2]):[0-5]\d(\s?)[AaPp][Mm]$/
     */
    public static isWallClockFormat(time: string): boolean {
        return (Validation.TIME_REGEX).test(time);
    }


    /**
     * Parses and extracts wall clock time data from a given correctly formatted wall clock time string.
     * @param time The time string to extract the wall clock time information from.
     * @return The wall clock time data.
     */
    private static parseWallClockTime(time: string): WallClockTime {

        let hoursMinuntesSplit: string[] = time.split(':');
        let wallClockTime: WallClockTime = new WallClockTime();

        wallClockTime.hours =  Number.parseInt(hoursMinuntesSplit[0]);
        wallClockTime.minutes = Number.parseInt(hoursMinuntesSplit[1].substr(0, 2));
        wallClockTime.amOrPm = time.substr(time.length - 2).toUpperCase();

        return wallClockTime;
    }


    /**
     * Combination of dateToMonthDayYearString() and dateToWallClockString() methods (MM/DD/YYYY hh:mm ['AM' | 'PM']). See them for more details.
     * @param date The date to convert to the string format.
     * @return The string format for the date.
     */
    public static dateToDateTimeString(date: Date): string {

        if (date != null) {
            // Check to see if we are in fact passed a Date object (may have been stringified in JSON response)!
            date = DateFormatter.ensureIsDate(date);

            return ( DateFormatter.dateToMonthDayYearString(date) + ' ' + DateFormatter.dateToWallClockString(date) );
        }

        return '';
    }


    /**
     * Gets the date corresponding to the first day (Sunday) of the current week.
     * @return The date of the first day of the current week.
     */
    public static getDateOfWeekStart(): Date {

        let now: Date = new Date();
        const weekday: number = now.getDay();
        now.setDate(now.getDate() - weekday);
        return now;
    }


    /**
     * Converts an integer day of the week to a string day of the week.
     * @param weekdayInt The integer in range [0, 6] representing a day of the week [Sunday, Saturday] accordingly.
     * @return The proper noun string representation of the day of the week.
     */
    public static covertWeekdayIntToString(weekdayInt: number): string {

        switch (weekdayInt) {
            case 0:     return 'Sunday';
            case 1:     return 'Monday';
            case 2:     return 'Tuesday';
            case 3:     return 'Wednesday';
            case 4:     return 'Thursday';
            case 5:     return 'Friday';
            case 6:     return 'Saturday';
            default:    throw new Error('Weekday int must be in range [0, 6], but this int was provided: ' + weekdayInt);
        }
    }


    /**
     * See convertWeekdayIntToString for more details. This is simply the reverse operation (but case insensitive).
     * @param weekdayString The string version of the day of the week (case insensitve).
     * @return The number representing the day of the week.
     */
    public static convertWeekdayStringToInt(weekdayString: string): number {

        switch (weekdayString.toLowerCase()) {
            case 'sunday':      return 0;
            case 'monday':      return 1;
            case 'tuesday':     return 2;
            case 'wednesday':   return 3;
            case 'thursday':    return 4;
            case 'friday':      return 5;
            case 'saturday':    return 6;
            default:            throw new Error('Weekday string must be a valid day of the week, but this string was provided: ' + weekdayString);
        }
    }


    /**
     * Sets a given date to the next occurence of a given weekday after today while preserving the time.
     * @param weekday The weekday index (where [0, 6] = [Sunday, Saturday]).
     * @param date The date to set.
     * @return The new date that has been set to the given weekday with time preserved.
     */
    public static setDateToWeekday(weekday: number, date: Date): Date {

        // Note: moment.js iso time starts with weekday Monday = 1 to Sunday = 7, but we want Sunday = 0 to Saturday = 6 as our app standard, so subtract 1 from weekday!
        let retDate: Date = moment(date).add(1, 'days').startOf('isoWeek').add(weekday - 1, 'days')
                            .add(date.getHours(), 'hours').add(date.getMinutes(), 'minutes').toDate();

        // If the calculated date is a weekday of this week on or before today, then push it to next week.
        return ( retDate.getDay() <= (new Date()).getDay() ) ? moment(retDate).add(7, 'days').toDate()
                                                             : retDate;
    }


    /**
     * Generates a date object from a given weekday and time. The generated Date object will be set on the next occurence of a given weekday after today at the specified time.
     * @param weekday The weekday index (where [0, 6] = [Sunday, Saturday]).
     * @param time The time to set for the generated date. Must be in wall clock time format: /^([1-9]|1[0-2]):[0-5]\d(\s?)[AaPp][Mm]$/ OR '12:00 AM' to '11:59 PM'.
     * @return The generated date object.
     *         NOTE: If the time is not in correct format, then null is returned.
     */
    public static genDateFromWeekdayAndTime(weekday: number, time: string): Date {

        let date: Date = DateFormatter.setWallClockTimeForDate(new Date(), time);

        return (date != null) ? DateFormatter.setDateToWeekday(weekday, date)
                              : null;
    }
}
