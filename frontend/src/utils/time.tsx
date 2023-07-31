
import { DateTime } from "luxon";

export const humanReadableDateTimeFromISO = (datetime: string) => {
    const date = DateTime.fromISO(datetime);
    return date.toLocaleString(DateTime.DATETIME_FULL);
}

export const humanReadableDateFromISO = (datetime: string) => {
    const date = DateTime.fromISO(datetime);
    return date.toLocaleString(DateTime.DATE_FULL);
}
