import {Pipe, PipeTransform} from '@angular/core';


/**
 * Pipe filter N last elements of a collection.
 *
 * Usage:
 *   {{[1, 2, 3, 4] | filterLast:2}}
 *   result: [3, 4]
 */
@Pipe({
  name: 'filterLast'
})
export class FilterLastPipe implements PipeTransform {
  transform(items: any[], n: number) {
    if (items) {
      return items.slice(items.length - n);
    }
    return items;
  }
}
