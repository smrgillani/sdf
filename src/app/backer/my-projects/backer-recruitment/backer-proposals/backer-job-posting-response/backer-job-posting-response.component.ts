import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbModalRef, NgbRatingConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

import { HireEmployeeModel } from 'app/projects/models/HireEmployeeModel';
import { ScheduleInterviewModel } from 'app/projects/models/ScheduleInterviewModel';
import { PublishJobModel } from 'app/projects/models/PublishJobModel';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { RecruitmentService } from 'app/projects/recruitment.service';
import { ChatService } from 'app/collaboration/chat.service';
import { StageStorage as InterviewAppliedService } from 'app/employeeprofile/stage-storage.service';
import { DocuSigndocpreviewComponent } from 'app/founder/projects/employee-profile/docu-signdocpreview/docu-signdocpreview.component';
import { MyInterviewRescheduleComponent } from 'app/employee/account/my-proposals/my-interview-reschedule/my-interview-reschedule.component';
import { ScheduledInterviewComponent } from 'app/founder/projects/recruitment/scheduled-interview/scheduled-interview.component';
import { AppointmentLetterComponent } from 'app/founder/projects/recruitment/appointment-letter/appointment-letter.component';

@Component({
  selector: 'app-backer-job-posting-response',
  templateUrl: './backer-job-posting-response.component.html',
  styleUrls: ['./backer-job-posting-response.component.scss'],
  providers: [PaginationMethods, NgbRatingConfig, InterviewAppliedService]
})
export class BackerJobPostingResponseComponent implements OnInit {

  pageSize = 5;
  count: number;
  private employees: HireEmployeeModel[];
  searchText: '';
  scheduleOn: string;
  scheduleInterviewData: ScheduleInterviewModel;
  stage: string;
  flagHired: boolean = false;
  private hireEmployeeFilters: PublishJobModel;
  @Input() projectId: number;
  popUpForDocuSignModalRef: NgbModalRef;
  popUpForShowInterestModalRef: NgbModalRef;
  @ViewChild('popUpForAddEmailMessage') popUpForAddEmailMessage;
  @ViewChild('popUpForCommonMessage') popUpForCommonMessage;
  errorMessage: string;

  constructor(private paginationMethods: PaginationMethods,
    private recruitmentService: RecruitmentService,
    private interviewAppliedService: InterviewAppliedService,
    private router: Router,
    private route: ActivatedRoute,
    private chatService: ChatService,
    config: NgbRatingConfig,
    private modalService: NgbModal) {
    config.max = 5;
    config.readonly = true;
    this.employees = [];
    this.scheduleInterviewData = new ScheduleInterviewModel();
    this.hireEmployeeFilters = new PublishJobModel();
  }

  ngOnInit() {
  }

  interviewletter(emp: any) {
    const modalRef = this.modalService.open(AppointmentLetterComponent, {
      size: 'lg',
      windowClass: 'appoitmentmodel'
    });
    modalRef.componentInstance.emp = emp;
    modalRef.componentInstance.letterFrom = 'myJobPosting';
    modalRef.componentInstance.projectId = this.projectId;
    modalRef.componentInstance.emitService.subscribe((emmitedValue) => {
      this.flagHired = emmitedValue;
      this.getNewEmpoloyeeList(1);
    });
  }

  ScheduledInterview(emp: any) {
    const modalRef = this.modalService.open(ScheduledInterviewComponent, {
      windowClass: 'interviewmodel'
    });
    modalRef.componentInstance.emp = emp;
    modalRef.componentInstance.status = 'schedule';
    modalRef.componentInstance.direct_hire = false;
    modalRef.componentInstance.projectId = this.projectId;
    modalRef.componentInstance.emitService.subscribe((emmitedValue) => {
      this.getNewEmpoloyeeList(1);
    });
  }

  rescheduleMyInterview(interviewData) {
    const modalRef = this.modalService.open(MyInterviewRescheduleComponent, {
      windowClass: 'interviewmodel modal-dialog-centered'
    });
    modalRef.componentInstance.rescheduledata = interviewData;
    modalRef.componentInstance.is_creator = true;
    modalRef.componentInstance.emitService.subscribe((emmitedValue) => {
      this.getNewEmpoloyeeList(1);
    });
  }

  ConfirmRescheduledInterview(interviewData) {
    interviewData.status = 'accept';
    this.interviewAppliedService.putRescheduleInterviewByCreator(interviewData).subscribe((response) => {
      this.getNewEmpoloyeeList(1);
    }, (errMsg) => {
      console.log(errMsg);
    });
  }

  getNewEmpoloyeeList(newPage) {
    if (newPage) {
      this.recruitmentService.jobPostingListForBacker(newPage, this.pageSize, this.searchText, this.projectId)
        .subscribe((empJob: HireEmployeeModel[]) => {
          this.employees = empJob['results'];
          this.count = empJob['count'];
        });
    }
  }

  valueChange() {
    if (this.searchText.length > 2 || this.searchText == '') {
      this.getNewEmpoloyeeList(1);
    }

  }

  getProfile(empId: any) {
    this.router.navigate(['backer/my-projects/' + this.projectId + '/recruitment/' + empId + '/profile']);
  }

  RejectApplication(id: number) {
    this.recruitmentService.putRejectJobApplication(id).subscribe((obj) => {
      this.getNewEmpoloyeeList(1);
    });
  }

  checkDocuSign(emp: any, template) {
    this.recruitmentService.getDocuSignStatus(emp.id, emp.offer_details.envelop).subscribe((obj) => {
      if (obj && obj.status && obj.status != '') {
        this.popUpForDocuSignModalRef = this.modalService.open(template, { backdrop: false });
      }
      else {
        const modalRef = this.modalService.open(DocuSigndocpreviewComponent, {
          size: 'lg',
          windowClass: 'appoitmentmodel'
        });
        modalRef.componentInstance.URL = obj.url;
      }
    });
  }

  projectMessage(employee: any) {
    this.errorMessage = '';
    this.chatService.postDirectRoom(this.projectId, employee.userprofile_id).subscribe(result => {
      const data = result.json();
      this.router.navigate(['../', 'chat-rooms', data['room']['_id']], { relativeTo: this.route.parent });
    }, (error) => {
      if (error['email'] == "Email is Required.") {
        this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForAddEmailMessage, { backdrop: false });
      }
      else if(error['_body']) {
        this.errorMessage = error['_body'];
        this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForCommonMessage, {backdrop: false});
      }
      else {
        this.errorMessage = error[0];
        this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForCommonMessage, { backdrop: false });
      }
    });
  }

  goToAccount() {
    this.popUpForShowInterestModalRef.close();
    this.router.navigate(['founder/account/edit']);
  }

}
