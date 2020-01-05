import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { BonusRequestInfo, HikeRequestInfo, QuitJobInfo } from 'app/employeeprofile/models/project-creator-info.model';
import { StageStorage as EmployeeService } from 'app/employeeprofile/stage-storage.service';

@Component({
  selector: 'app-bonus-hike-reject-status',
  templateUrl: './bonus-hike-reject-status.component.html',
  styleUrls: ['./bonus-hike-reject-status.component.scss'],
  providers: [EmployeeService]
})
export class BonusHikeRejectStatusComponent implements OnInit {

  @Input() id: number;
  bonusRequestInfo: BonusRequestInfo;
  hikeRequestInfo: HikeRequestInfo;
  quitJobRequestInfo: QuitJobInfo;
  status: string = 'new';
  completed: boolean = false;
  @Input() type: string;
  @Input() openFrom: string;
  @Output() emitService = new EventEmitter();

  constructor(public activeModal: NgbActiveModal,
    private employeeService: EmployeeService) { }

  ngOnInit() {
    if (this.type == 'Bonus') {
      this.employeeService.getBounusRequest(this.id).subscribe((obj) => {
        this.bonusRequestInfo = obj;
        this.status = obj.status;
        console.log('bonusRequestInfo:', this.bonusRequestInfo);
      });
    }
    else if (this.type == 'Hike') {
      this.employeeService.getHikeRequest(this.id).subscribe((obj) => {
        this.hikeRequestInfo = obj;
        this.status = obj.status;
        console.log('hikeRequestInfo:', this.hikeRequestInfo);
      });
    }
    else if (this.type == 'QuitJob') {
      this.employeeService.getQuitJobRequest(this.id).subscribe((obj) => {
        this.quitJobRequestInfo = obj;
        this.status = obj.status; 
        this.completed = obj.completed;
        console.log('quitJobRequestInfo:', this.quitJobRequestInfo);
      });
    }
  }

  updateRequestStatus(status: string) {
    if (this.type == 'Bonus') {
      this.employeeService.putBounusRequest({id: this.id, status: status}).subscribe((obj) => {
        console.log(obj);
        this.emitService.next(true);
        this.activeModal.close();
      });
    }
    else if (this.type == 'Hike') {
      this.employeeService.putHikeRequest({id: this.id, status: status}).subscribe((obj) => {
        console.log(obj);
        this.emitService.next(true);
        this.activeModal.close();
      });
    }
    else if (this.type == 'QuitJob') {
      this.employeeService.putQuitJobRequest({id: this.id, status: status, notice_period:this.quitJobRequestInfo.notice_period}).subscribe((obj) => {
        console.log(obj);
        this.emitService.next(true);
        this.activeModal.close();
      });
    }
  }
}
