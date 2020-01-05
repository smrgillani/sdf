import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-temp-common-message',
  templateUrl: './temp-common-message.component.html',
  styleUrls: ['./temp-common-message.component.scss']
})
export class TempCommonMessageComponent implements OnInit {

  message = 'Please, update your personal info to save your current progress.';
  
  constructor(public activeModal: NgbActiveModal, private router: Router) { }

  ngOnInit() {
  }

  closePopUp() {
    this.activeModal.close();
  }

  editProfile() {
    this.activeModal.close();
    this.router.navigate(['/founder/account/edit']);
  }

}
