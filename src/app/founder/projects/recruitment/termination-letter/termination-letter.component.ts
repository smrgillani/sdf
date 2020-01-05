import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FireEmployeeData } from 'app/projects/models/ScheduleInterviewModel';
import { RecruitmentService } from 'app/projects/recruitment.service';
import { Subscription } from "rxjs/Subscription";
import { concat } from 'rxjs/observable/concat';
import * as moment from 'moment';

import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';

import UserProfileModel from 'app/core/models/UserProfileModel';
import { AccountService } from '../../../account/account.service';
import { LoaderService } from 'app/loader.service';

@Component({
  selector: 'app-termination-letter',
  templateUrl: './termination-letter.component.html',
  styleUrls: ['./termination-letter.component.css']
})
export class TerminationLetterComponent implements OnInit {
  @Input() emp;
  @Input() projectId: number;
  //@Input() letterFrom;
  @Output() emitService = new EventEmitter();
  @ViewChild('content') content: ElementRef;

  empId: number;
  fireEmployee: FireEmployeeData;
  appointmentLetterTemplate: string;
  today: string;
  editablemode: boolean[] = [];
  companyName: string = '';
  userProfile: UserProfileModel;
  isEmailHide: boolean = false;

  constructor(public activeModal: NgbActiveModal,
    private accountService: AccountService,
    private recruitmentService: RecruitmentService,
    private loaderService: LoaderService
  ) {
    this.fireEmployee = new FireEmployeeData();
    this.fireEmployee.working_title = "";
    this.fireEmployee.company_name = "";
    this.fireEmployee.termination_reason1 = "";
    this.fireEmployee.termination_reason2 = "";
    this.fireEmployee.termination_reason3 = "";
    this.fireEmployee.termination_reason4 = "";
    this.fireEmployee.termination_reason5 = "";
    this.userProfile = new UserProfileModel();
  }

  ngOnInit() {
    this.editablemode[0] = false;
    this.editablemode[1] = false;
    this.editablemode[2] = false;
    this.editablemode[3] = false;
    this.editablemode[4] = false;
    this.editablemode[5] = false;
    this.editablemode[6] = false;

    var d = new Date();
    this.today = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
    this.empId = this.emp.id;

    if (this.projectId && this.projectId != 0) {
      this.recruitmentService.getProjectById(this.projectId).flatMap((project) => {
        this.companyName = project.title.toUpperCase();
        return this.accountService.getProfile();
      }).flatMap((userInfo)=>{
        this.userProfile = userInfo; 
        return this.recruitmentService.getFireEmployee(this.empId);
      }).subscribe((data: FireEmployeeData) => {
        this.setValues(data);
      },
        (err: any) => {
          console.log(err);
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

  sendFireLetter() {
    const self = this;
    self.isEmailHide = true;
    const fireEmployeeMain: any = Object.assign({}, self.fireEmployee);
    fireEmployeeMain.termination_date = moment(self.fireEmployee.termination_date).format('YYYY-MM-DD');
    fireEmployeeMain.emp_id = self.empId;
    fireEmployeeMain.project = self.projectId;    
    fireEmployeeMain.document_name = 'Termination.pdf';
    self.loaderService.loaderStatus.next(true);

    let content = self.content.nativeElement;
    html2canvas(content).then((canvas) => {
      let img = canvas.toDataURL("image/png");
      let doc = new jsPDF();
      //doc.addImage(img, 'JPEG', 5, 5);
      doc.addImage(img,'JPEG', 2,2, 210, 200);
      fireEmployeeMain.creatorXposition = 50;
      fireEmployeeMain.creatorYposition = 435;
      //doc.save('Termination.pdf')
      fireEmployeeMain.document = doc.output('datauristring');
      
      self.recruitmentService.sendFireRequest(fireEmployeeMain)
        .subscribe((obj: string) => {
          self.emitService.next(true);
          self.activeModal.close();
          self.loaderService.loaderStatus.next(false);
        },
          (err: any) => {
            console.log(err);
            self.isEmailHide = false;
            self.loaderService.loaderStatus.next(false);
          });
    });


  }

  setValues(value) {
    this.fireEmployee.name = value.name != null && value.name != undefined ? value.name : "";
    this.fireEmployee.working_title = value.working_title != null && value.working_title != undefined ? value.working_title : "";
    this.fireEmployee.company_name = value.company_name != null && value.company_name != undefined ? value.company_name : this.companyName && this.companyName != '' ? this.companyName : '';
    this.fireEmployee.termination_reason1 = value.termination_reason1 != null && value.termination_reason1 != undefined ? value.termination_reason1 : "";
    this.fireEmployee.termination_reason2 = value.termination_reason2 != null && value.termination_reason2 != undefined ? value.termination_reason2 : "";
    this.fireEmployee.termination_reason3 = value.termination_reason3 != null && value.termination_reason3 != undefined ? value.termination_reason3 : "";
    this.fireEmployee.termination_reason4 = value.termination_reason4 != null && value.termination_reason4 != undefined ? value.termination_reason4 : "";
    this.fireEmployee.termination_reason5 = value.termination_reason5 != null && value.termination_reason5 != undefined ? value.termination_reason5 : "";

    this.fireEmployee.create_date = this.today;
    this.fireEmployee.termination_date = value.termination_date != null && value.termination_date != undefined ? moment(value.termination_date).toDate() : new Date();
    this.fireEmployee.address = value.address != null && value.address != undefined ? value.address : "";
    this.fireEmployee.city = value.city != null && value.city != undefined ? value.city : "";
    this.fireEmployee.state = value.state != null && value.state != undefined ? value.state : "";
    this.fireEmployee.zip = value.zip != null && value.zip != undefined ? value.zip : "";
    this.fireEmployee.project = this.projectId;

    this.fireEmployee.creator_email = this.userProfile.email;
  }
}
