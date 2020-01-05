import {Component, OnInit, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import * as _ from 'lodash';

@Component({
    selector:'app-business-address',
    templateUrl:'./business-address.component.html',
    styleUrls:['./business-address.component.scss'],
    providers:[
        {
            provide:NG_VALUE_ACCESSOR,
            useExisting:forwardRef(()=> BusinessAddressComponent),
            multi:true
        }
    ]
})
export class BusinessAddressComponent implements ControlValueAccessor, OnInit {
    @Input() isSummary = false;
    business_address:{
        'DesignatedOfficeAddressInCA':{'Address':string,City:string, State:string, ZipCode:string},
        'MailingAddress':{'Address':string,City:string, State:string, ZipCode:string}
    };
    constructor() {
        this.business_address = {
            'DesignatedOfficeAddressInCA' : {'Address':'',City:'', State:'CA', ZipCode:''},
            'MailingAddress' : {'Address':'',City:'', State:'CA', ZipCode:''}
          };
    }
    writeValue(value: any) {
        if (value) {
          this.business_address = value;
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
    
      ngOnInit() {

      }

      onDataChange(){
        this.onChange(this.business_address);
      }
}