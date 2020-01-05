import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Ng2DatetimePickerModule } from 'ng2-datetime-picker';
import { StageStorage as InterviewAppliedService } from 'app/employeeprofile/stage-storage.service';

@Component({
  selector: 'app-my-interview-reschedule',
  templateUrl: './my-interview-reschedule.component.html',
  styleUrls: ['./my-interview-reschedule.component.scss'],
  providers: [InterviewAppliedService]
})
export class MyInterviewRescheduleComponent implements OnInit {

  @Input() rescheduledata;
  @Input() is_creator: boolean;
  @Output() emitService = new EventEmitter();
  //scheduleOn: string = '';
  scheduleOn: Date = new Date();
  myTimeSpan = 5*60*1000;
  todaysDate: Date = new Date();

  constructor(private activeModal: NgbActiveModal, private interviewAppliedService: InterviewAppliedService) { }

  ngOnInit() {
    this.scheduleOn.setTime(this.scheduleOn.getTime()+this.myTimeSpan);
  }

  scheduleIt() {
    if(this.scheduleOn != undefined && this.scheduleOn.toString() != ''){
      if(!this.is_creator){
        // this.interviewAppliedService.postRescheduleInterview({ reschedule_interview_date_time: !this.is_creator ? moment(this.scheduleOn).format('YYYY-MM-DD HH:mm').toString() : moment(this.rescheduledata.reschedule_interview_date_time).format('YYYY-MM-DD HH:mm').toString(),
        // reschedule_interview_date_time_creator: this.is_creator ? moment(this.scheduleOn).format('YYYY-MM-DD HH:mm').toString() : this.rescheduledata.reschedule_interview_date_time_creator == undefined ? null : moment(this.rescheduledata.reschedule_interview_date_time_creator).format('YYYY-MM-DD HH:mm').toString(), 
        // is_creator: this.is_creator ? this.is_creator : false, is_employee: this.is_creator ? false : true, interview_id: this.rescheduledata.id }).
        this.interviewAppliedService.postRescheduleInterview({ reschedule_interview_date_time: !this.is_creator ? moment(this.scheduleOn).format('YYYY-MM-DD HH:mm').toString() : this.rescheduledata.reschedule_interview_date_time,
        reschedule_interview_date_time_creator: this.is_creator ? moment(this.scheduleOn).format('YYYY-MM-DD HH:mm').toString() : this.rescheduledata.reschedule_interview_date_time_creator, 
        is_creator: this.is_creator ? this.is_creator : false, is_employee: this.is_creator ? false : true, interview_id: this.rescheduledata.id }).
        subscribe((response) => {
          this.emitService.next(response);
          this.activeModal.close();
          location.reload();
        }, (errMsg) => {
          console.log(errMsg);
        });
      }
      else{
        // this.interviewAppliedService.putRescheduleInterviewByCreator({ id: this.rescheduledata.id, reschedule_interview_date_time: !this.is_creator ? moment(this.scheduleOn).format('YYYY-MM-DD HH:mm').toString() : moment(this.rescheduledata.reschedule_interview_date_time).format('YYYY-MM-DD HH:mm').toString(),
        // reschedule_interview_date_time_creator: this.is_creator ? this.scheduleOn != undefined && this.scheduleOn != null ? moment(this.scheduleOn).format('YYYY-MM-DD HH:mm').toString() : this.rescheduledata.reschedule_interview_date_time_creator == undefined ? null : moment(this.rescheduledata.reschedule_interview_date_time_creator).format('YYYY-MM-DD HH:mm').toString() : 
        //     this.rescheduledata.reschedule_interview_date_time_creator == undefined ? null : moment(this.rescheduledata.reschedule_interview_date_time_creator).format('YYYY-MM-DD HH:mm').toString(), 
        // is_creator: this.is_creator ? this.is_creator : false, is_employee: this.is_creator ? false : true, interview_id: this.rescheduledata.id }).
        this.interviewAppliedService.putRescheduleInterviewByCreator({ id: this.rescheduledata.id, reschedule_interview_date_time: !this.is_creator ? moment(this.scheduleOn).format('YYYY-MM-DD HH:mm').toString() : this.rescheduledata.reschedule_interview_date_time,
        reschedule_interview_date_time_creator: this.is_creator ? this.scheduleOn != undefined && this.scheduleOn != null ? moment(this.scheduleOn).format('YYYY-MM-DD HH:mm').toString() : this.rescheduledata.reschedule_interview_date_time_creator : 
            this.rescheduledata.reschedule_interview_date_time_creator == undefined ? null : this.rescheduledata.reschedule_interview_date_time_creator, 
        is_creator: this.is_creator ? this.is_creator : false, is_employee: this.is_creator ? false : true, interview_id: this.rescheduledata.interview_id }).
        subscribe((response) => {
          this.emitService.next(response);
          this.activeModal.close();
          //location.reload();
        }, (errMsg) => {
          console.log(errMsg);
        });
      }
    }
    
  }
}
