import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StageStorage as AppointmentAppliedService } from 'app/employeeprofile/stage-storage.service';
import { NgbModal, NgbModalOptions, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TermsOfUseContent } from '../../../../home/terms-of-use/terms-of-use.component';
import {ProjectsService, Visibility} from 'app/projects/projects.service';
import { RecruitmentService } from 'app/projects/recruitment.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-my-appointment-letter',
  templateUrl: './my-appointment-letter.component.html',
  styleUrls: ['./my-appointment-letter.component.scss'],
  providers: [ProjectsService, RecruitmentService, NgbActiveModal]
})
export class MyAppointmentLetterComponent implements OnInit {
  id: number;
  isApply: boolean;
  isNone: boolean = false;
  appointmentData: any;
  ndaChecked: boolean = false;
  showNda: boolean;
  popUpOptions: NgbModalOptions = { backdrop: false, windowClass: 'center-position', size: 'lg' };
  ndaContent: String = '';
  docuSignUrl: string= '';

  constructor(private appointmentAppliedService: AppointmentAppliedService,
    private route: ActivatedRoute, private router: Router, private modalService: NgbModal, 
    private recruitmentService: RecruitmentService,
    private projectService: ProjectsService,
    private _location: Location
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.isApply = (params['isApply'] === 'true');
      if (this.isApply) {
        this.getAppliedAppointment();
      }
      else {
        if(params['isApply'] === 'none'){
          this.isNone = true;
          this.getDirectAppointment();
        }
        else{
          this.getReqAppointment();
        }
      }
    });
  }

  getReqAppointment() {
    this.appointmentAppliedService.getRecuiterInterviewReqJoin(this.id).subscribe((obj) => {
      console.log(obj);
      if (obj) {
        this.appointmentData = obj;
        this.showNda = obj.show_nda;
        this.recruitmentService.getDocuSignStatus(obj.emp_id, obj.envelop).subscribe((docSign)=>{
          this.parseDocument(docSign.url);
          //this.docuSignUrl = docSign.url;
        });
      }
    });
  }

  getAppliedAppointment() {
    this.appointmentAppliedService.getAppliedRecuiterInterviewReqJoin(this.id).subscribe((obj) => {
      console.log(obj);
      if (obj) {
        this.appointmentData = obj;
        this.showNda = obj.show_nda;
        this.recruitmentService.getDocuSignStatus(obj.emp_id, obj.envelop).subscribe((docSign)=>{
          this.parseDocument(docSign.url);
          //this.docuSignUrl = docSign.url;
        });
      }
    });
  }

  getDirectAppointment() {
    this.appointmentAppliedService.getDirectHireReqJoin(this.id).subscribe((obj) => {
      console.log(obj);
      if (obj) {
        this.appointmentData = obj;
        this.showNda = obj.show_nda;
        this.recruitmentService.getDocuSignStatus(obj.emp_id, obj.envelop).subscribe((docSign)=>{
            this.parseDocument(docSign.url);
        });
          //this.docuSignUrl = docSign.url;
      };
    });
  }

  parseDocument(url){
    this.projectService.downloadDocusign(url).subscribe((blob: Blob) => {
      var file = new Blob([(blob)], {type: 'application/pdf'});
      var fileURL = URL.createObjectURL(file);
      this.docuSignUrl = fileURL;
    });
  }

  putRecuiterReqAppointment() {
    this.appointmentData.accept_nda = this.ndaChecked;
    this.appointmentAppliedService.putRecuiterDirectReqJoin(this.appointmentData, this.id).subscribe((updateJoin) => {
      console.log(updateJoin);
      this.router.navigate([`my-proposals`], {relativeTo: this.route.parent});
    }, (errorMsg: any) => {
      console.log(errorMsg);
    });
  }

  putAppliedAppointment() {
    this.appointmentData.accept_nda = this.ndaChecked;
    this.appointmentAppliedService.putAppliedJobJoin(this.appointmentData, this.id).subscribe((updateJoin) => {
      console.log(updateJoin);
      this.router.navigate([`my-proposals`], {relativeTo: this.route.parent});
    }, (errorMsg: any) => {
      console.log(errorMsg);
    });
  }

  putDirectAppointment() {
    this.appointmentData.accept_nda = this.ndaChecked;
    this.appointmentAppliedService.putDirectJoin(this.appointmentData, this.id).subscribe((updateJoin) => {
      console.log(updateJoin);
      this.router.navigate([`my-proposals`], {relativeTo: this.route.parent});
    }, (errorMsg: any) => {
      console.log(errorMsg);
    });
  }

  openNdaModal(content) {
    this.projectService.fetchTermsAndCondition()
    .subscribe(
      data => {
        this.ndaContent = data.description;
        const modalRef = this.modalService.open(content, this.popUpOptions);        
      },
      error => {
        console.log(error);
      }
    );        
  }
}
