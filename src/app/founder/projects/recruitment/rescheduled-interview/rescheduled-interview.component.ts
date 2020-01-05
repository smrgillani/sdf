import { Component, OnInit } from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { Ng2DatetimePickerModule } from 'ng2-datetime-picker';


@Component({
  selector: 'app-rescheduled-interview',
  templateUrl: './rescheduled-interview.component.html',
  styleUrls: ['./rescheduled-interview.component.scss']
})
export class RescheduledInterviewComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
