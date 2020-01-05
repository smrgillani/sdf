import * as moment from 'moment';
/**
 *  Time Utils function that display time ago
 */
export class TimeUtils {

  public static PROJECT_ID = null;

  private static SECOND_MILLIS = 1000;
  private static MINUTE_MILLIS = 60 * TimeUtils.SECOND_MILLIS;
  private static HOUR_MILLIS = 60 * TimeUtils.MINUTE_MILLIS;
  private static DAY_MILLIS = 24 * TimeUtils.HOUR_MILLIS;
  private static MONTH_MILLIS = 30 * TimeUtils.DAY_MILLIS;
  private static YEAR_MILLIS = 12 * TimeUtils.MONTH_MILLIS;

  public static getSectionValue(obj: any): any {
    obj = new Date(obj);
    return this.getTimeAgo(obj.getTime());
  }

  private static getTimeAgo(time): string {
    if (time < 1000000000000) {
      // if timestamp given in seconds, convert to millis
      time *= 1000;
    }

    const now = new Date().getTime();
    if (time > now || time <= 0) {

      const diffInTime = now - time;
      if (diffInTime < -(24 * this.HOUR_MILLIS)) {
        return 'Today';
      } else if (diffInTime < -(48 * this.HOUR_MILLIS)) {
        return 'Yesterday';
      } else if (diffInTime <= -(7 * this.DAY_MILLIS)) {
        return 'Last Week';
      } else if (diffInTime > -(7 * this.DAY_MILLIS) && diffInTime < -(31 * this.DAY_MILLIS)) {
        return Math.floor(diffInTime / this.DAY_MILLIS) + ' days ago';
      } else if (diffInTime < -(12 * this.MONTH_MILLIS)) {
        const months = Math.floor(diffInTime / this.MONTH_MILLIS);
        if (months === 1) {
          return '1 month ago';
        } else {
          return months + ' months ago';
        }
      } else {
        const years = Math.floor(diffInTime / this.YEAR_MILLIS);
        if (years === 1) {
          return '1 year ago';
        } else {
          return years + ' years ago';
        }
      }

    }

    const diff = now - time;
    if (diff < 24 * this.HOUR_MILLIS) {
      return 'Today';
    } else if (diff < 48 * this.HOUR_MILLIS) {
      return 'Yesterday';
    } else if (diff <= 7 * this.DAY_MILLIS) {
      return 'Last Week';
    } else if (diff > 7 * this.DAY_MILLIS && diff < 31 * this.DAY_MILLIS) {
      return Math.floor(diff / this.DAY_MILLIS) + ' days ago';
    } else if (diff < 12 * this.MONTH_MILLIS) {
      const months = Math.floor(diff / this.MONTH_MILLIS);
      if (months === 1) {
        return '1 month ago';
      } else {
        return months + ' months ago';
      }
    } else {
      const years = Math.floor(diff / this.YEAR_MILLIS);
      if (years === 1) {
        return '1 year ago';
      } else {
        return years + ' years ago';
      }
    }
  }

  public static getLocalTime(obj): Date {
    const gmtDateTime = moment.utc(obj);
    const local = gmtDateTime.local();
    local.format('YYYY-MM-DD HH:mm:ss');
    return local.toDate();
  }

  public static getDateInll(dateTime) {
    return moment(dateTime).format('llll');
  }

  public static getTime(dateTime) {
    return moment(dateTime).format('LTS');
  }

  public static getDurationToHour(duration) {
    const seconds = moment.duration(duration).seconds();
    const minutes = moment.duration(duration).minutes();
    const hours = Math.trunc(moment.duration(duration).asHours());

    if (hours === 0 && ( minutes < 1  || minutes === 1 && seconds === 0) ) {
       return null;
    }

    return ((hours < 10) ? '0' + hours : hours) + ':'
      + ((minutes < 10) ? '0' + minutes : minutes) + ':'
      + ((seconds < 10) ? '0' + seconds : seconds);
  }

  // Todo:: Try to change
 /* public static convertUTCZeroTimeFromUTCOffset(dateTime, offset) {
    return  moment.utc(dateTime).utcOffset( parseInt(offset, 10) * 60).format('YYYY-MM-DD HH:mm:ss');
  }*/

  public static convertStringToDate(obj): Date {
    if (typeof obj === 'string') {
      obj = obj.replace(/\s/, 'T');
    }
    return moment(obj).toDate();
  }

  public static getUTCStringFromDateObj(obj): String {
    return moment.utc(obj).format('YYYY-MM-DD HH:mm:ss');
  }
}
