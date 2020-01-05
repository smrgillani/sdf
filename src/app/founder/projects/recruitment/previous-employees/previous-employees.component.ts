import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { NgbRatingConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RecruitmentService } from 'app/projects/recruitment.service';
import { HireEmployeeModel } from 'app/projects/models/HireEmployeeModel';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentLetterComponent } from '../appointment-letter/appointment-letter.component';
import { DocuSigndocpreviewComponent } from 'app/founder/projects/employee-profile/docu-signdocpreview/docu-signdocpreview.component';
import { ChatService } from 'app/collaboration/chat.service';
import {ProjectsService, Visibility} from 'app/projects/projects.service';

@Component({
  selector: 'app-previous-employees',
  templateUrl: './previous-employees.component.html',
  styleUrls: ['./previous-employees.component.css'],
  providers: [PaginationMethods, NgbRatingConfig]
})
export class PreviousEmployeesComponent implements OnInit {
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
    private projectService: ProjectsService,
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
      this.recruitmentService.previousEmployeeList(newPage, this.pageSize, this.searchText)
        .subscribe((empJob: HireEmployeeModel[]) => {
          this.employees = empJob['results'];
          this.count = empJob['count'];
          // this.paginationReset = false;
        });
    }
  }
  valueChange() {
    // if(this.searchText.length>2 || this.searchText==undefined || this.searchText==''|| this.searchText==null)
    if (this.searchText.length > 2 || this.searchText == '') {
      //this.paginationReset = true;
      this.getPreviousEmpoloyeeList(1);
    }

  }
  interviewletter(emp: any) {
    const modalRef = this.modalService.open(AppointmentLetterComponent, {
      size: 'lg',
      windowClass: 'appoitmentmodel'
    });
    modalRef.componentInstance.emp = emp;
    modalRef.componentInstance.projectId = this.projectId;
    modalRef.componentInstance.letterFrom = 'previousEmployee';
    modalRef.componentInstance.emitService.subscribe((emmitedValue) => {
      this.flagHired = emmitedValue;
    });
  }

  getProfile(empId: any) {
    this.router.navigate(['founder/projects/' + this.projectId + '/recruitment/' + empId + '/profile']);
  }

  checkDocuSign(emp: any, template) {
    this.recruitmentService.getDocuSignStatus(emp.userprofile_id, emp.termination_envelop).subscribe((obj)=>{
      if(obj && obj.status && obj.status != '') {
        this.popUpForDocuSignModalRef = this.modalService.open(template, {backdrop: false});
      }
      else {
        const modalRef = this.modalService.open(DocuSigndocpreviewComponent, {
          size: 'lg',
          windowClass: 'appoitmentmodel'
        });

        this.projectService.downloadDocusign(obj.url).subscribe((blob: Blob) => {
              var file = new Blob([(blob)], {type: 'application/pdf'});
              var fileURL = URL.createObjectURL(file);
              modalRef.componentInstance.URL = fileURL;
              modalRef.componentInstance.isPopup = true;
            });
        //modalRef.componentInstance.URL = obj.url;
      }
    });
  }

  checkDocuSignReHire(emp: any, template) {
    this.recruitmentService.getDocuSignStatus(emp.id, emp.rehire_envelop).subscribe((obj)=>{
      if(obj && obj.status && obj.status != '') {
        this.popUpForDocuSignModalRef = this.modalService.open(template, {backdrop: false});
      }
      else {
        const modalRef = this.modalService.open(DocuSigndocpreviewComponent, {
          size: 'lg',
          windowClass: 'appoitmentmodel'
        });
        
        this.projectService.downloadDocusign(obj.url).subscribe((blob: Blob) => {
              var file = new Blob([(blob)], {type: 'application/pdf'});
              var fileURL = URL.createObjectURL(file);
              modalRef.componentInstance.URL = fileURL;
              modalRef.componentInstance.isPopup = true;
            });
        //modalRef.componentInstance.URL = obj.url;
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
