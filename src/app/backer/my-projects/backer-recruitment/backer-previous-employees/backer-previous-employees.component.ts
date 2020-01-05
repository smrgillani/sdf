import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbModalRef, NgbRatingConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

import { ChatService } from 'app/collaboration/chat.service';
import { RecruitmentService } from 'app/projects/recruitment.service';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { HireEmployeeModel } from 'app/projects/models/HireEmployeeModel';

@Component({
  selector: 'app-backer-previous-employees',
  templateUrl: './backer-previous-employees.component.html',
  styleUrls: ['./backer-previous-employees.component.scss'],
  providers: [PaginationMethods, NgbRatingConfig]
})
export class BackerPreviousEmployeesComponent implements OnInit {

  pageSize = 5;
  count: number;
  private employees: HireEmployeeModel[];
  searchText: '';
  flagHired: boolean = false;
  @Input() projectId: number;
  @Input() rateFor: string;
  popUpForDocuSignModalRef: NgbModalRef;
  popUpForShowInterestModalRef: NgbModalRef;
  @ViewChild('popUpForAddEmailMessage') popUpForAddEmailMessage;
  @ViewChild('popUpForCommonMessage') popUpForCommonMessage;
  errorMessage: string;
  
  constructor(private paginationMethods: PaginationMethods,
    private recruitmentService: RecruitmentService,
    private router: Router,
    private route: ActivatedRoute,
    private chatService: ChatService,
    config: NgbRatingConfig,
    private modalService: NgbModal) { 
      config.max = 5;
      config.readonly = true;
    }

  ngOnInit() {
  }

  getPreviousEmpoloyeeList(newPage) {
    if (newPage) {
      this.recruitmentService.previousEmployeeListForBacker(newPage, this.pageSize, this.searchText, this.projectId)
        .subscribe((empJob: HireEmployeeModel[]) => {
          this.employees = empJob;
          this.count = empJob['count'];
        });
    }
  }
  valueChange() {
    if (this.searchText.length > 2 || this.searchText == '') {
      this.getPreviousEmpoloyeeList(1);
    }

  }
  interviewletter(emp: any) {
    // const modalRef = this.modalService.open(AppointmentLetterComponent, {
    //   size: 'lg',
    //   windowClass: 'appoitmentmodel'
    // });
    // modalRef.componentInstance.emp = emp;
    // modalRef.componentInstance.projectId = this.projectId;
    // modalRef.componentInstance.letterFrom = 'previousEmployee';
    // modalRef.componentInstance.emitService.subscribe((emmitedValue) => {
    //   this.flagHired = emmitedValue;
    // });
  }

  getProfile(empId: any) {
    this.router.navigate(['backer/my-projects/' + this.projectId + '/recruitment/' + empId + '/profile']);
  }

  checkDocuSign(emp: any, template) {
    this.recruitmentService.getDocuSignStatus(emp.id, emp.termination_envelop).subscribe((obj)=>{
      if(obj && obj.status && obj.status != '') {
        this.popUpForDocuSignModalRef = this.modalService.open(template, {backdrop: false});
      }
      else {
        // const modalRef = this.modalService.open(DocuSigndocpreviewComponent, {
        //   size: 'lg',
        //   windowClass: 'appoitmentmodel'
        // });
        // modalRef.componentInstance.URL = obj.url;
      }
    });
  }

  checkDocuSignReHire(emp: any, template) {
    this.recruitmentService.getDocuSignStatus(emp.id, emp.rehire_envelop).subscribe((obj)=>{
      if(obj && obj.status && obj.status != '') {
        this.popUpForDocuSignModalRef = this.modalService.open(template, {backdrop: false});
      }
      else {
        // const modalRef = this.modalService.open(DocuSigndocpreviewComponent, {
        //   size: 'lg',
        //   windowClass: 'appoitmentmodel'
        // });
        // modalRef.componentInstance.URL = obj.url;
      }
    });
  }

  metrices(emp: HireEmployeeModel) {
    this.router.navigate(['founder/projects/' + this.projectId + '/recruitment/' + emp.id + '/ProcessesWorkedOn']);
  }

  projectMessage(employee:any) {
    this.errorMessage = '';
    this.chatService.postDirectRoom(this.projectId,employee.userprofile_id).subscribe(result => {
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

}
