import {Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import * as _ from 'lodash';


/**
 * Time input.
 *
 * @model ngModel - Date object
 */
@Component({
  selector: 'app-time-input',
  template: `
    <ngb-timepicker [(ngModel)]="time"
                    (ngModelChange)="onTimeChange($event)">
    </ngb-timepicker>
  `,
  styles: [`
    input.form-control {
      color: inherit;
      font-size: inherit;
      background: inherit;
      border: inherit;
      border-radius: inherit;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeInputComponent),
      multi: true
    }
  ]
})
export class TimeInputComponent implements ControlValueAccessor {
  date: Date;
  time: DummyTime;

  onTimeChange(time: DummyTime) {
    this.date.setHours(time.hour);
    this.date.setMinutes(time.minute);
    this.date.setSeconds(time.second);
    this.onChange(this.date);
  }

  writeValue(value: Date) {
    this.date = value;
    if (value) {
      this.time = new DummyTime(value);
    }
  }

  onChange = (_) => {};
  onTouched = () => {};
  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}

class DummyTime {
  hour: number;
  minute: number;
  second: number;

  constructor(date: Date) {
    this.hour = date.getHours();
    this.minute = date.getMinutes();
    this.second = date.getSeconds();
  }
}
