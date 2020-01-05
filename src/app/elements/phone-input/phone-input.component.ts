import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _ from 'lodash';
import { PhoneService } from './services/phone.service';


/**
 * International phone number input.
 *
 * @model ngModel - phone number value
 */
@Component({
  selector: 'app-phone-input',
  template: `
  <div class="input-group">
    <div class="input-group-addon"><img *ngIf="flag && flag['flag']" [src]="flag['flag'] | safeUrl" width="22"></div>
    <input class="form-control"
                    placeholder="Phone"
                    type="text"
                    [(ngModel)]="phone"
                    (ngModelChange)="onPhoneChange($event)"
                    [textMask]="{mask: phoneMask}" />
  </div>`,
  styles: [`

.input-group-addon
  {
    padding: 0;
    border: 0;
    background: transparent;
    border-bottom: 1px solid #010dff;
    border-radius: 0;
    padding-right: 10px;
  }
  .form-control {
    display: block;
    width: 100%;
    height: 38px;
    padding: .5rem 0;
    border: 0;
    border-bottom: 1px solid #010DFF;
    background-color: transparent;
    color: rgba(31,30,170, .9);
    font-size: 18px;
    font-weight: 400;
    line-height: 22px;
    border-radius:0;

    &:focus {
      outline: 0 none;
    }
  }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true
    }, PhoneService
  ]
})
export class PhoneInputComponent implements ControlValueAccessor {
  phone: string;
  flag: any;// = 'https://www.countryflags.io/se/flat/64.png'; <img [src]="'https://www.countryflags.io/' + flag['flag'] + '/flat/64.png'" width="16">

  phoneMask = (value): any[] => {
    const localMask = [
      //'(', /\d/, /\d/, /\d/, ')',
      /\d/, /\d/, /\d/,
      '-', /\d/, /\d/, /\d/,
      '-', /\d/, /\d/, /\d/, /\d/];
    const cleanValue = value.replace(/[_()\-+]/g, '');
    let codeLength = cleanValue.length - 10;
    if (codeLength > 3) {
      codeLength = 3;
    } else if (codeLength < 1) {
      codeLength = 1;
    }
    return []
      .concat(['+']).concat(['('])
      .concat(_.map(_.range(codeLength), () => /\d/)).concat([')'])
      .concat(localMask);
  }

  constructor(private phoneService: PhoneService) { 
    this.phoneService.getCountryCodeByIp().subscribe((response) =>{
      console.log('code:', response);
    });

  }

  onPhoneChange(phone: string) {
    let isdCode = phone && phone != '' ? parseInt(phone.substring(phone.indexOf('(') + 1, phone.indexOf(')'))) : 0
    this.phoneService.getCountryFlagByPhone(isdCode).subscribe((flag) =>{
      this.flag = flag;
    });
    this.onChange(phone.replace(/[()\-]/g, ''));
  }

  writeValue(value: string) {
    value ? this.phone = value : this.phone = '';
    if(value){
      let isdCode: number
      if(value.length == 12 ){
        isdCode = this.phone && this.phone != '' ? parseInt(this.phone.substring(1, 2)) : 0;
      }
      else if(value.length == 13){
        isdCode = this.phone && this.phone != '' ? parseInt(this.phone.substring(1, 3)) : 0;
      }
      else {
        isdCode = this.phone && this.phone != '' ? parseInt(this.phone.substring(1, 4)) : 0;
      }
      this.phoneService.getCountryFlagByPhone(isdCode).subscribe((flag) =>{
        this.flag = flag;
      });
    }
  }

  onChange = (_) => { };
  onTouched = () => { };
  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
