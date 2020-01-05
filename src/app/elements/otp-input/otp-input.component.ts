import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import * as _ from 'lodash';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';


/**
 * One Time Password Input
 *
 * @model ngModel - password value
 * @input segments - number of password parts
 * @input segmentLength - length of one password part
 */
@Component({
  selector: 'app-otp-input',
  template: `
    <div class="otp-input">
      <input type="text" class="form-control"
             *ngFor="let segment of segmentValues; let index = index"
             [(ngModel)]="segmentValues[index].value"
             (ngModelChange)="onSegmentChange($event, index)"
             [minlength]="segmentLength"
             [maxlength]="segmentLength"
             id="segment-{{index}}" />
    </div>
  `,
  styles: [`
    .otp-input {
      border: inherit;
      border-width: 0;
      border-radius: inherit;
      display: flex;
    }
    .otp-input input {
      color: inherit;
      font-size: inherit;
      text-align: center;
      background: inherit;
      border: inherit;
      border-bottom-width: 2px;
      border-radius: inherit;
      width: 100%;

      margin-right: 6px;
    }
    .otp-input input:last-child {
      margin-right: 0;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OtpInputComponent),
      multi: true
    }
  ]
})
export class OtpInputComponent implements ControlValueAccessor {
  @Input() segments: number;
  @Input() segmentLength: number;

  segmentValues: {value: string}[];

  constructor() {
    this.segmentValues = _.map(_.range(this.segments), () => ({value: ''}));
  }

  onSegmentChange(segment: string, index) {
    this.onChange(_.map(this.segmentValues, (s) => {
      return ' '.repeat(this.segmentLength - s.value.length).concat(s.value);
    }).join(''));

    if (segment === '' && index > 0) {
      document.getElementById(`segment-${index - 1}`).focus();
    } else if (segment.length >= this.segmentLength && index < this.segments - 1) {
      document.getElementById(`segment-${index + 1}`).focus();
    }
  }

  writeValue(value: string) {
    for (let i = 0; i < this.segments; i++) {
      if (!this.segmentValues[i]) {
        this.segmentValues[i] = {value: ''};
      }
      this.segmentValues[i].value = value.slice(
        i * this.segmentLength,
        (i + 1) * this.segmentLength
      );
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
