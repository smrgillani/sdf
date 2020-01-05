import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';


/**
 * Transform date in past to verbose form relatively to now moment.
 * For example: '4 minutes ago', 'one hour ago' etc.
 *
 * Usage:
 *   {{ someDateTimeValue | formatRelativeTime }}
 */
@Pipe({
  name: 'formatRelativeTime'
})
export class FormatRelativeTimePipe implements PipeTransform {
  transform(time: string) {
    return moment(time).fromNow();
  }
}
