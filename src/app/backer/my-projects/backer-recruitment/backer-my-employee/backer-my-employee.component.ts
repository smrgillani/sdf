import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbModalRef, NgbRatingConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

import { HireEmployeeModel } from 'app/projects/models/HireEmployeeModel';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { RecruitmentService } from 'app/projects/recruitment.service';
import { ChatService } from 'app/collaboration/chat.service';

@Component({
  selector: 'app-backer-my-employee',
  templateUrl: './backer-my-employee.component.html',
  styleUrls: ['./backer-my-employee.component.scss'],
  providers: [PaginationMethods, NgbRatingConfig]
})
export class BackerMyEmployeeComponent implements OnInit {

  @Input() projectId: number;
  @Input() rateFor: string;
  private employees: HireEmployeeModel[];
  pageSize = 5;
  count: number;
  searchText: '';
  flagFired: boolean = false;
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

  getMyEmpoloyeeList(newPage) {
    if (newPage) {
      this.recruitmentService.myEmployeeListForBacker(newPage, this.pageSize, this.searchText, this.projectId)
        .subscribe((empJob: HireEmployeeModel[]) => {
          this.employees = empJob;
          this.count = empJob['count'];
        });
    }
  }
  valueChange() {
    if (this.searchText.length > 2 || this.searchText == '') {
      this.getMyEmpoloyeeList(1);
    }
  }
  pay(emp: HireEmployeeModel) {
    this.router.navigate(['backer/my-projects/' + this.projectId + '/recruitment/' + emp.id + '/pay']);
  }
  fire(emp: any) {
    // const modalRef = this.modalService.open(TerminationLetterComponent, {
    //   size: 'lg',
    //   windowClass: 'appoitmentmodel'
    // });
    // modalRef.componentInstance.emp = emp;
    // modalRef.componentInstance.projectId = this.projectId;
    // modalRef.componentInstance.emitService.subscribe((emmitedValue) => {
    //   this.flagFired = emmitedValue;
    //   this.getMyEmpoloyeeList(1);
    // });
  }

  metrices(emp: HireEmployeeModel) {
    this.router.navigate(['founder/projects/' + this.projectId + '/recruitment/' + emp.id + '/ProcessesWorkedOn']);
  }

  getProfile(empId: any) {
    this.router.navigate(['backer/my-projects/' + this.projectId + '/recruitment/' + empId + '/profile']);
  }

  checkDocuSign(emp: any, template) {
    this.recruitmentService.getDocuSignStatus(emp.id, emp.rehire_envelop).subscribe((obj) => {
      if (obj && obj.status && obj.status != '') {
        this.popUpForDocuSignModalRef = this.modalService.open(template, { backdrop: false });
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
