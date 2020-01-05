import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { StageStorage as RecruiterInterviewReqService } from 'app/employeeprofile/stage-storage.service';
import { RecruitmentService } from 'app/projects/recruitment.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ChatService } from 'app/collaboration/chat.service';

@Component({
  selector: 'app-recruiter-interview-request',
  templateUrl: './recruiter-interview-request.component.html',
  styleUrls: ['./recruiter-interview-request.component.scss'],
  providers: [PaginationMethods, RecruitmentService]
})
export class RecruiterInterviewRequestComponent implements OnInit {
  pageSize = 5;
  count: number;
  recruiterInterviewRequest: any[];
  popUpForDocuSignModalRef: NgbModalRef;
  popUpForShowInterestModalRef: NgbModalRef;
  @ViewChild('popUpForAddEmailMessage') popUpForAddEmailMessage;
  @ViewChild('popUpForCommonMessage') popUpForCommonMessage;
  errorMessage: string;
  
  constructor(private paginationMethods: PaginationMethods,
    private recruiterInterviewReqService: RecruiterInterviewReqService,
    private recruitmentService: RecruitmentService,
    private modalService: NgbModal,
    private chatService: ChatService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    //this.getRecuiterInterviewReq(1);
  }
  /**
   * used for sending the interviewRequest id of Recuiter
   * @param interviewRequest 
   */
  joinForAppointment(data, template) {
    this.recruitmentService.getDocuSignStatus(data.offer_details.emp_id, data.offer_details.envelop).subscribe((obj)=>{
      if(obj && obj.status && obj.status != '') {
        this.popUpForDocuSignModalRef = this.modalService.open(template, {backdrop: false});
      }
      else {
        this.router.navigate([`${data.id}/${false}/appointment-letter`], { relativeTo: this.route.parent });
      }
    });
  }

  rejectForAppointment(id: number) {
    this.recruiterInterviewReqService.putRejectRecuiterReqJoin(null,id).subscribe((obj) => {
      this.getRecuiterInterviewReq(1);
    });
  }

  RescheduledInterview(id: number) {
    this.router.navigate([`${id}/${false}/interview`], { relativeTo: this.route.parent });
  }

  RejectInterview(id: number) {
    this.recruiterInterviewReqService.putRejectRecuiterInterviewReqSchedule(null,id).subscribe((obj) => {
      this.getRecuiterInterviewReq(1);
    });
  }

  Message(projectId) {
    this.errorMessage = '';
    this.chatService.postDirectRoom(projectId).subscribe(result => {
      const data = result.json();
      this.router.navigate(['../', 'chat-rooms', data['room']['_id']], { relativeTo: this.route.parent });
    }, (error) => {
      if(error['email'] == "Email is Required.") {
        this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForAddEmailMessage, {backdrop: false});
      }
      else if(error['_body']) {
        this.errorMessage = error['_body'];
        this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForCommonMessage, {backdrop: false});
      }
      else {
        this.errorMessage = error[0];
        this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForCommonMessage, {backdrop: false});
      }
    });
  }

  goToAccount() {
    this.popUpForShowInterestModalRef.close();
    this.router.navigate(['founder/account/edit']);
  }

  getRecuiterInterviewReq(newPage) {
    if (newPage) {
      this.recruiterInterviewReqService.getRecuiterInterviewReq(newPage, this.pageSize).subscribe((recIntReq) => {
        this.recruiterInterviewRequest = recIntReq['results'];
        this.count = recIntReq['count'];
      });
    }
  }

  interviewActions(req:any){
    return req.status === 'schedule' || req.status === 'accept';
  }

}
