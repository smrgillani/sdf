import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { StageStorage as ApplyForJobService } from 'app/employeeprofile/stage-storage.service';
import { RecruitmentService } from 'app/projects/recruitment.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatService } from 'app/collaboration/chat.service';

@Component({
  selector: 'app-apply-for',
  templateUrl: './apply-for.component.html',
  styleUrls: ['./apply-for.component.scss'],
  providers: [PaginationMethods, RecruitmentService]
})
export class ApplyForComponent implements OnInit {
  pageSize = 5;
  count: number;
  myJobApply: any[];
  popUpForDocuSignModalRef: NgbModalRef;
  popUpForShowInterestModalRef: NgbModalRef;
  @ViewChild('popUpForAddEmailMessage') popUpForAddEmailMessage;
  @ViewChild('popUpForCommonMessage') popUpForCommonMessage;
  errorMessage: string;
  
  constructor(private paginationMethods: PaginationMethods, 
    private recruitmentService: RecruitmentService,
    private applyForJobService: ApplyForJobService,
    private modalService: NgbModal,
    private chatService: ChatService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    //this.getJobApply(1);
  }

  RescheduledInterview(id: number) {
    let flag: boolean = false;
    this.router.navigate([`${id}/${true}/interview`], { relativeTo: this.route.parent });
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
        this.router.navigate([`${data.id}/${true}/appointment-letter`], { relativeTo: this.route.parent });
      }
    });
  }

  rejectForAppointment(id: number) {
    this.applyForJobService.putRejectAppliedRecuiterReqJoin(null,id).subscribe((obj) => {
      this.getJobApply(1);
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

  RejectInterview(id: number) {
    this.applyForJobService.putRejectAppliedRecuiterInterviewReqSchedule(null,id).subscribe((obj) => {
      this.getJobApply(1);
    });
  }

  getJobApply(newPage){
    if(newPage) {
      this.applyForJobService.getJobApply(newPage, this.pageSize).subscribe((appliedJob) => {
        this.myJobApply = appliedJob['results'];
        this.count = appliedJob['count'];
      });
    }
  }

}
