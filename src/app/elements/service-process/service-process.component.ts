import {Component, OnInit, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import * as _ from 'lodash';

@Component({
    selector:'app-service-process',
    templateUrl:'./service-process.component.html',
    styleUrls:['./service-process.component.scss'],
    providers:[
        {
            provide:NG_VALUE_ACCESSOR,
            useExisting:forwardRef(()=> ServiceProcessComponent),
            multi:true
        }
    ]
})
export class ServiceProcessComponent implements ControlValueAccessor, OnInit {
    @Input() isSummary = false;
    service_process:{
        'CaliforniaAgentName':{'FirstName':string,'MiddleName':string,'LastName':string,'Suffix':string},
        'MailingAddress':{'Address':string,City:string, State:string, ZipCode:string},
        'Corporation':string
    };
    constructor() {
        this.service_process = {
            'CaliforniaAgentName':{'FirstName':'Batis','MiddleName':'','LastName':'Samadian','Suffix':'Mr.'},
            'MailingAddress' : {'Address':'',City:'', State:'CA', ZipCode:''},
            'Corporation':''
          };
    }
    writeValue(value: any) {
        if (value) {
          this.service_process = value;
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
        this.onChange(this.service_process);
      }
}