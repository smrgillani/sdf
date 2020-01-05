import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Ng2DatetimePickerModule } from 'ng2-datetime-picker';
import * as moment from 'moment';
import { RecruitmentService } from 'app/projects/recruitment.service';
import { ScheduleInterviewModel } from 'app/projects/models/ScheduleInterviewModel';
import { ListingData, SelectItem } from 'app/employeeprofile/models/employee-professional-info';

@Component({
  selector: 'app-scheduled-interview',
  templateUrl: './scheduled-interview.component.html',
  styleUrls: ['./scheduled-interview.component.scss']
})
export class ScheduledInterviewComponent implements OnInit {
  @Input() emp;
  @Input() status;
  @Input() direct_hire;
  @Input() projectId: number;
  @Input() isJobList: boolean = false;
  @Output() emitService = new EventEmitter();

  name: string;
  //scheduleOn: string;
  scheduleOn: Date = new Date();
  myTimeSpan = 5*60*1000;
  todaysDate: Date = new Date();

  scheduleInterviewData: ScheduleInterviewModel;
  jobList: SelectItem[];
  jobListObj: any;
  selectedjobId: string = '';
  selectedjobDescription: string = 'We have liked your profile and have a job offer for you. Before we can take the next step, it will be nice to talk about our expectations. Let\'s get connected.Feel free to message us for more details.';
  isValidDate: boolean;

  constructor(public activeModal: NgbActiveModal,
    private recruitmentService: RecruitmentService) {
    this.scheduleInterviewData = new ScheduleInterviewModel();
    this.scheduleOn.setTime(this.scheduleOn.getTime()+this.myTimeSpan);
  }

  ngOnInit() {
    this.name = this.emp.first_name || this.emp.last_name;
    if(this.isJobList) {
      this.recruitmentService.getJobList(this.projectId).subscribe((obj: any) => {
        this.jobListObj = obj;
        this.jobList = [];
        obj.forEach(e => {
          this.jobList.push({
            //label as well as value should have same value
            id: e.id, label: e.title, value: e.id
          });
        });
      },
        (errorMsg: any) => {
          console.log(errorMsg);
        }
      );
    }
  }

  scheduleIt() {
    if(!this.isValidDate && this.scheduleOn != undefined && this.scheduleOn.toString() != ''){
      this.scheduleInterviewData.interview_date_time = moment(this.scheduleOn).format('YYYY-MM-DD HH:mm').toString();
      //get owner from profile service
  
      //this.scheduleInterviewData.job=this.emp.current_designation;
      //this.scheduleInterviewData.employee= this.emp.id;//****************
      this.scheduleInterviewData.employee = this.emp.availability_details[0].userprofile_id;
      this.scheduleInterviewData.status = this.status;
      this.scheduleInterviewData.job_title = this.emp.job_title;
      this.scheduleInterviewData.is_direct_hire = this.direct_hire;
      this.scheduleInterviewData.job = this.emp.job_id != undefined && !this.isJobList ? this.emp.job_id : this.selectedjobId;//this.emp.job_id; //****************
      this.scheduleInterviewData.job_application = this.isJobList ? null : this.emp.id;
      this.scheduleInterviewData.project = this.projectId;
      this.scheduleInterviewData.job_description = this.isJobList ? this.selectedjobDescription : '';
      //post all this data
      this.recruitmentService.scheduleInterview(this.scheduleInterviewData)
        .subscribe(
        (response: string) => {
          //navigate to password-updated page
          //this.close();
          this.emitService.next(true);
          this.activeModal.close();
        },
        (errMsg: any) => {
          console.log(errMsg);
        });
    }
  }

  onJobSelect(value) {
    this.selectedjobDescription = this.jobListObj != null && this.jobListObj.length > 0 ? this.jobListObj.filter(a=>a.id == value).map(a=>a.description)[0] : '';
  }

  checkDateValidation() {
    if(moment(this.scheduleOn).toDate() < moment(new Date).toDate())
    {
      this.isValidDate=true;
    }
    else
    {
      this.isValidDate=false;
     // this.flagFromDate=false;
    }
  }
}
