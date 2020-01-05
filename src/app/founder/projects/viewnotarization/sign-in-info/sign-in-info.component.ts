import { Component, OnInit, Input } from '@angular/core';
import { NotarizeResponse } from '../../../../projects/models/project-notarization-model';

@Component({
  selector: 'app-sign-in-info',
  templateUrl: './sign-in-info.component.html',
  styleUrls: ['./sign-in-info.component.scss']
})
export class SignInInfoComponent implements OnInit {
  
  @Input() notarizeResponse: NotarizeResponse;
  
  constructor() { }

  ngOnInit() {
    if(this.notarizeResponse && this.notarizeResponse.notarised_documents && this.notarizeResponse.notarised_documents.length > 0) {
      this.notarizeResponse.notarised_documents.forEach((element)=>{
        let arr = element.document.split('/');
        element.document_name = arr.find(a=>a.includes('?')).split('?')[0];
      });      
    }
  }

}
