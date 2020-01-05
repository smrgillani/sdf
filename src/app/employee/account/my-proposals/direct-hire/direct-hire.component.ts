import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { StageStorage as RecruiterDirectHireService } from 'app/employeeprofile/stage-storage.service';
import { RecruitmentService } from 'app/projects/recruitment.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ChatService } from 'app/collaboration/chat.service';

@Component({
  selector: 'app-direct-hire',
  templateUrl: './direct-hire.component.html',
  styleUrls: ['./direct-hire.component.scss'],
  providers: [PaginationMethods, RecruitmentService]
})
export class DirectHireComponent implements OnInit {
  
  pageSize = 5;
  count: number;
  recruiterDirectHireRequest: any[];
  popUpForDocuSignModalRef: NgbModalRef;
  popUpForShowInterestModalRef: NgbModalRef;
  @ViewChild('popUpForAddEmailMessage') popUpForAddEmailMessage;
  @ViewChild('popUpForCommonMessage') popUpForCommonMessage;
  errorMessage: string;

  constructor(private paginationMethods: PaginationMethods,
    private recruiterDirectHireService: RecruiterDirectHireService,
    private recruitmentService: RecruitmentService,
    private modalService: NgbModal,
    private chatService: ChatService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.getRecuiterInterviewReq(0);
  }

  joinForAppointment(data: any, template) {
    
    this.recruitmentService.getDocuSignStatus(data.emp_id, data.envelop).subscribe((obj)=>{
      if(obj && obj.status && obj.status != '') {
        this.popUpForDocuSignModalRef = this.modalService.open(template, {backdrop: false});
      }
      else {
        this.router.navigate([`${data.id}/none/appointment-letter`], { relativeTo: this.route.parent });    
      }
    });
  }

  rejectForAppointment(id: number) {
    this.recruiterDirectHireService.putRejectDirectHireReqJoin(null,id).subscribe((obj) => {
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
      this.recruiterDirectHireService.getRecuiterDirectHireReq(newPage, this.pageSize).subscribe((recHireReq) => {
        this.recruiterDirectHireRequest = recHireReq['results'];
        this.count = recHireReq['count'];
      });
    }
    /*this.recruiterDirectHireService.getRecuiterDirectHireReq(null, null).subscribe((recHireReq) => {
      this.recruiterDirectHireRequest = recHireReq;
    });*/
  }

}
