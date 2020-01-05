import { Pipe, PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/primeng';

/*
 * Converts array of objects to a format compatible with PrimeNG's Dropdown component
 * Usage:
 *  array | formatSelectItem:'Description':'Key'"
 * Example:
 *  dict[{id: 1, name: 'name'}] | formatSelectItem:'id':'name'
 *  formats to: [{ value: '1' , label: 'name'}]
*/

@Pipe({
  name: 'formatSelectItem'
})
export class FormatSelectItemPipe implements PipeTransform {
  transform(value: any[], valueProperty: string, labelProperty: string): SelectItem[] {
    if (value) {
     return value.map(function (item) {
        return {
          value: item[valueProperty],
          label: item[labelProperty]
        };
      });
    }
  }
}