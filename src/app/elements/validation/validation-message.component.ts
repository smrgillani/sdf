import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-validation-message',
  templateUrl: 'validation-message.component.html',
  styleUrls: [
    'validation-message.component.scss'
  ],
  providers: []
})
export class ValidationMessageComponent implements OnInit {
  @Input() fields: any;
  @Input() messages: any;
  @Input() msgArray: any;
  clientErrorExists: Boolean = false;

  constructor() {};

  getFields (field) {
    if (field){
      return Object.keys(field);
    } else{
      return [];
    }
  }

  getErrors (erros) {
    if (erros){
      this.clientErrorExists = true;
      return Object.keys(erros);
    } else{
      return [];
    }
  }

  getControlName(control:string, error:string){
    if(control==='common'){
      return '';
    }
    if(error.includes(control)){
      return '';
    }
    return `${control} - `;
  }

  ngOnInit()
  {  
  }
}
