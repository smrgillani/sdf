import { Component, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-chat-filters',
  templateUrl: './chat-filters.component.html',
  styleUrls: ['./chat-filters.component.scss'],
})
export class ChatFiltersComponent {
  values: _.Dictionary<any> = {
    'starred': false,
  };

  @Output() filtersChanged = new EventEmitter<_.Dictionary<any>>();

  getFilterValue(filterName: string) {
    return this.values[filterName];
  }

  toggleFilterValue(filterName: string) {
    this.values[filterName] = !this.values[filterName];

    this.filtersChanged.emit(this.values);
  }
}
