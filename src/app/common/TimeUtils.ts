import {JulianDate} from 'cesium';
import {IANA_TIMEZONES, IanaTimezone} from './TimeZones';

export class TimeUtils {

  public static parseUtcDateTime(dateTimeStringUtc): Date {
    const dtString = dateTimeStringUtc.endsWith('Z') ? dateTimeStringUtc : dateTimeStringUtc + 'Z';
    return JulianDate.toDate(JulianDate.fromIso8601(dtString));
  }

  public static formatTime(dt: Date, timeZone: IanaTimezone): string {
    if (dt.getUTCFullYear() === 1901) {
      return '';
    }

    const dtFormat: Intl.DateTimeFormat = new Intl.DateTimeFormat('en-US', {
      timeZone: timeZone.timezone,
      // timeZoneName: "short",
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    return dtFormat.format(dt);
  }

  public static getUTCTimeZone(): IanaTimezone {
    return { group: 'UTC', timezone: 'UTC', label: 'UTC (UTC)' };
  }

  public static getTimeZones(): IanaTimezone[] {
    return IANA_TIMEZONES;
  }


}
