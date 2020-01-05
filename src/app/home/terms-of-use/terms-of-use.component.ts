import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Http} from '@angular/http';
import {TermsOfUseService} from './terms-of-use.service';
import * as _ from 'lodash';

@Component({
  selector: 'ngbd-modal-content',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{title}}</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true"></span>
      </button>
    </div>
    <div class="modal-body" [innerHTML]="description">
      //<p>{{description}}</p>
    </div>    
  `,
  styleUrls: ['terms-of-use.component.scss'],
  providers: [TermsOfUseService]
})
export class TermsOfUseContent implements OnInit {
  @Input() title;
  @Input() description = '';

  privacyPolicy:string = '';
  tos:string = '';
  tou:string = '';

  constructor(
    public activeModal: NgbActiveModal, 
    public termsOfUseService: TermsOfUseService) {}

  ngOnInit() {
    this.termsOfUseService.getPrivacyPolicy().subscribe(
      (response) => {
        console.log(response);
        if(response)
        {
          let pp = _.find(response, (q) => q['various'] === 'privacy');
          this.privacyPolicy = pp?pp['description']:'Not yet defined';

          let tos = _.find(response, (q) => q['various'] === 'tos');
          this.tos = tos?tos['description']:'Not yet defined';

          let tou = _.find(response, (q) => q['various'] === 'terms');
          this.tou = tou?tou['description']:'Not yet defined';
        }
        this.setDescription();
      }
    );    
  }

  setDescription(){
    if (this.title === 'Privacy Policy') {
      this.description = this.privacyPolicy;
      return;
    }

    if (this.title === 'Terms of Use') {
      this.description = this.tou;
      return;
    }

    if (this.title === 'Terms of Service') {
      this.description = this.tos;
      return;
    }
  }
}