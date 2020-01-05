import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from "rxjs/Subscription";
import { concat } from 'rxjs/observable/concat';
import * as moment from 'moment';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';

import { HireEmployeeData } from 'app/projects/models/ScheduleInterviewModel';
import { RecruitmentService } from 'app/projects/recruitment.service';

import UserProfileModel from 'app/core/models/UserProfileModel';
import { AccountService } from '../../../account/account.service';
import { LoaderService } from 'app/loader.service';


@Component({
  selector: 'app-appointment-letter',
  templateUrl: './appointment-letter.component.html',
  styleUrls: ['./appointment-letter.component.css'],
})
export class AppointmentLetterComponent implements OnInit {
  @Input() emp;
  @Input() letterFrom;
  @Input() projectId: number;
  @Output() emitService = new EventEmitter();

  @ViewChild('content') content: ElementRef;

  htmlToPdf: string;

  empId: number;
  hireEmployee: HireEmployeeData;
  appointmentLetterTemplate: string;
  today: string;
  editablemode: boolean[] = [];
  flagHired: boolean = false;
  companyName: string = '';

  userProfile: UserProfileModel;
  isEmailHide: boolean = false;


  constructor(public activeModal: NgbActiveModal,
    private accountService: AccountService,
    private recruitmentService: RecruitmentService,
    private loaderService: LoaderService
  ) {
    this.hireEmployee = new HireEmployeeData();
    this.hireEmployee.name = "";
    this.hireEmployee.workingTitle = "";
    this.hireEmployee.department = "";
    this.hireEmployee.tenureStatus = "";
    this.hireEmployee.duration = "";
    this.hireEmployee.salaryParameters = "";
    this.hireEmployee.availability = "";
    this.hireEmployee.departmentContribution = "";
    this.hireEmployee.responsibilities1 = "";
    this.hireEmployee.responsibilities2 = "";
    this.hireEmployee.responsibilities3 = "";
    this.flagHired = false;
    this.userProfile = new UserProfileModel();

    // this.appointmentLetterTemplateData=new AppointmentLetterTemplate();
    //this.today= Date.now();
  }

  ngOnInit() {
    this.getUserProfile();
    this.editablemode[0] = false;
    this.editablemode[1] = false;
    this.editablemode[2] = false;
    this.editablemode[3] = false;
    this.editablemode[4] = false;
    this.editablemode[5] = false;
    this.editablemode[6] = false;
    this.editablemode[7] = false;
    this.editablemode[8] = false;
    //var d = new Date, dformat = [(d.toLocaleDateString())].join('/') + ' ' + [d.getHours(), d.getMinutes()].join(':');
    var d = new Date();
    this.today = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();

    if (this.projectId && this.projectId != 0) {
      this.recruitmentService.getProjectById(this.projectId).subscribe((obj) => {
        if (obj) {
          this.companyName = obj.title.toUpperCase();
        }
      });
    }


    if (this.letterFrom == 'hireEmployee') {
      this.empId = this.emp.id;
      this.recruitmentService.getHireEmployee(this.empId)
        .subscribe((data: HireEmployeeData) => {
          this.setValues(data);
          // this.hireEmployee = data;   
          // this.hireEmployee.onDate=this.today;                    
        });
    }
    if (this.letterFrom == 'directHire') {
      this.empId = this.emp.id;
      this.recruitmentService.getDirectHireEmployee(this.empId)
        .subscribe((data: HireEmployeeData) => {
          // this.hireEmployee = data;   
          // this.hireEmployee.onDate=this.today;                    
          this.setValues(data);
        });
    }

    if (this.letterFrom == 'myJobPosting') {
      this.empId = this.emp.id;
      this.recruitmentService.getJobPostingEmployee(this.empId)
        .subscribe((data: HireEmployeeData) => {
          // this.hireEmployee = data;   
          // this.hireEmployee.onDate=this.today;                    
          this.setValues(data);
        });
    }
    if (this.letterFrom == 'previousEmployee') {
      this.empId = this.emp.id;
      this.recruitmentService.getPreviousEmployee(this.empId)
        .subscribe((data: HireEmployeeData) => {
          if (data != undefined) {
            this.setValues(data);
            // this.hireEmployee = data;   
            // this.hireEmployee.onDate=this.today;                    
          }
        });
    }
  }


  togglefocus(e, x, varnum) {
    this.editablemode[varnum] = true
    setTimeout(() => {
      x.focus();
    }, 0);
  }
  maxlength(e, textlength) {
    if (e.target.innerText.length >= textlength) {
      return false;
    }
  }
  sendAppointment() {
    this.isEmailHide = true;
    setTimeout(() => {
      const self = this;
      const hireEmployeeMain: any = Object.assign({}, self.hireEmployee);
      hireEmployeeMain.beginningDate = moment(self.hireEmployee.beginningDate).format('YYYY-MM-DD');
      hireEmployeeMain.project = self.projectId;
      hireEmployeeMain.emp_id = self.empId;
      hireEmployeeMain.document_name = 'Appointment.pdf';
      hireEmployeeMain.creatorXposition = 50;
      hireEmployeeMain.creatorYposition = 725;
      hireEmployeeMain.employeeXposition = 355;
      hireEmployeeMain.employeeYposition = 725;
      self.loaderService.loaderStatus.next(true);

      let content = self.content.nativeElement;
      html2canvas(content, { useCORS: true })
        .then((canvas) => {
          let img = canvas.toDataURL("image/png");
          let doc = new jsPDF();
          //doc.addImage(img,'JPEG',1,5);
          //doc.addImage(img,'JPEG', 2, 3, 220, 300)
          doc.addImage(img, 'JPEG', 2, 2, 210, 300)
          hireEmployeeMain.document = doc.output('datauristring');

          if (self.letterFrom == 'hireEmployee') {
            self.recruitmentService.sendAppointment(hireEmployeeMain)
              .subscribe(
                (response: string) => {
                  self.emitService.next(true);
                  self.activeModal.close();
                  self.loaderService.loaderStatus.next(false);
                },
                (errMsg: any) => {
                  console.log(errMsg);
                  self.isEmailHide = false;
                  self.loaderService.loaderStatus.next(false);
                }
              );
          }
          if (self.letterFrom == 'directHire') {
            self.recruitmentService.sendDirectHireAppointment(hireEmployeeMain)
              .subscribe(
                (response: string) => {
                  self.emitService.next(true);
                  self.activeModal.close();
                  self.loaderService.loaderStatus.next(false);
                },
                (errMsg: any) => {
                  console.log(errMsg);
                  self.isEmailHide = false;
                  self.loaderService.loaderStatus.next(false);
                }
              );
          }
          if (self.letterFrom == 'myJobPosting') {
            self.recruitmentService.sendJobPostingAppointment(hireEmployeeMain)
              .subscribe(
                (response: string) => {
                  self.emitService.next(true);
                  self.activeModal.close();
                  self.loaderService.loaderStatus.next(false);
                },
                (errMsg: any) => {
                  console.log(errMsg);
                  self.isEmailHide = false;
                  self.loaderService.loaderStatus.next(false);
                }
              );
          }
          if (self.letterFrom == 'previousEmployee') {
            self.recruitmentService.sendReHireAppointment(hireEmployeeMain)
              .subscribe(
                (response: string) => {
                  self.emitService.next(true);
                  self.activeModal.close();
                  self.loaderService.loaderStatus.next(false);
                },
                (errMsg: any) => {
                  console.log(errMsg);
                  self.isEmailHide = false;
                  self.loaderService.loaderStatus.next(false);
                }
              );
          }
        });
    }, 0)


  }

  setValues(value) {
    //this.basicinfo.date_of_birth = this.basicinfo.date_of_birth != null && this.basicinfo.date_of_birth != undefined ? moment(this.basicinfo.date_of_birth).toDate() :  new Date((_date.getFullYear() - 9),_date.getMonth() + 1 ,_date.getDate()),
    this.hireEmployee.name = value.name != null && value.name != undefined ? value.name : "";
    this.hireEmployee.workingTitle = value.workingTitle != null && value.workingTitle != undefined ? value.workingTitle : "";
    this.hireEmployee.department = value.department != null && value.department != undefined ? value.department : "";
    this.hireEmployee.tenureStatus = value.tenureStatus != null && value.tenureStatus != undefined ? value.tenureStatus : "";

    this.hireEmployee.duration = value.duration != null && value.duration != undefined ? value.duration : "";

    this.hireEmployee.salaryParameters = value.salaryParameters != null && value.salaryParameters != undefined ? value.salaryParameters : "";

    this.hireEmployee.availability = value.availability != null && value.availability != undefined ? value.availability : "";

    this.hireEmployee.departmentContribution = value.departmentContribution != null && value.departmentContribution != undefined ? value.departmentContribution : "";

    this.hireEmployee.responsibilities1 = value.responsibilities1 != null && value.responsibilities1 != undefined ? value.responsibilities1 : "";

    this.hireEmployee.responsibilities2 = value.responsibilities2 != null && value.responsibilities2 != undefined ? value.responsibilities2 : "";

    this.hireEmployee.responsibilities3 = value.responsibilities3 != null && value.responsibilities3 != undefined ? value.responsibilities3 : "";
    this.hireEmployee.onDate = this.today;
    //beginningDate
    this.hireEmployee.beginningDate = value.beginningDate != null && value.beginningDate != undefined ? moment(value.beginningDate).toDate() : new Date();
    // address:string;
    this.hireEmployee.address = value.address != null && value.address != undefined ? value.address : "";
    // city:string; 
    this.hireEmployee.city = value.city != null && value.city != undefined ? value.city : "";
    // state:string;
    this.hireEmployee.state = value.state != null && value.state != undefined ? value.state : "";
    // zip:string;
    this.hireEmployee.zip = value.zip != null && value.zip != undefined ? value.zip : "";
    //emp_id
    this.hireEmployee.project = this.projectId;

    //User Email
    this.hireEmployee.creator_email = this.userProfile.email;
  }

  getUserProfile() {
    this.accountService.getProfile().subscribe((userProfile: UserProfileModel) => {
      this.userProfile = userProfile;
    });
  }
}
