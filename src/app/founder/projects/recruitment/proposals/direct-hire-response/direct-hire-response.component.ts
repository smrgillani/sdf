import { Component, OnInit,Input, ViewChild } from '@angular/core';
import {PaginationMethods} from 'app/elements/pagination/paginationMethods';
import {NgbRatingConfig, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RecruitmentService} from 'app/projects/recruitment.service';
import {HireEmployeeModel} from 'app/projects/models/HireEmployeeModel';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { AppointmentLetterComponent } from '../../appointment-letter/appointment-letter.component';
import { ScheduledInterviewComponent } from '../../scheduled-interview/scheduled-interview.component';
import {Router, ActivatedRoute} from '@angular/router';
import {ScheduleInterviewModel} from 'app/projects/models/ScheduleInterviewModel';
import {PublishJobModel} from 'app/projects/models/PublishJobModel';
import { MyInterviewRescheduleComponent } from 'app/employee/account/my-proposals/my-interview-reschedule/my-interview-reschedule.component';
import { StageStorage as InterviewAppliedService } from 'app/employeeprofile/stage-storage.service';
import { DocuSigndocpreviewComponent } from 'app/founder/projects/employee-profile/docu-signdocpreview/docu-signdocpreview.component';
import { ChatService } from 'app/collaboration/chat.service';
import {ProjectsService, Visibility} from 'app/projects/projects.service';

@Component({
  selector: 'app-direct-hire-response',
  templateUrl: './direct-hire-response.component.html',
  styleUrls: ['./direct-hire-response.component.css'],
  providers: [PaginationMethods, NgbRatingConfig, InterviewAppliedService]
})
export class DirectHireResponseComponent implements OnInit {
  pageSize = 5;
  count: number; 
  private employees:HireEmployeeModel[];
  searchText: '';
  scheduleOn:string;
  // _scheduleOnSubscription: Subscription = new Subscription();
  scheduleInterviewData: ScheduleInterviewModel;
  stage:string;
  flagHired:boolean=false;
  //_hireEmployeeFiltersSubscription: Subscription = new Subscription();
  private hireEmployeeFilters: PublishJobModel;
  @Input() projectId: number;
  popUpForDocuSignModalRef: NgbModalRef;
  popUpForShowInterestModalRef: NgbModalRef;
  @ViewChild('popUpForAddEmailMessage') popUpForAddEmailMessage;
  @ViewChild('popUpForCommonMessage') popUpForCommonMessage;
  errorMessage: string;

  constructor(private paginationMethods: PaginationMethods,
    private recruitmentService:RecruitmentService,
    private projectService: ProjectsService,
    private interviewAppliedService: InterviewAppliedService,
    config: NgbRatingConfig,
    private chatService: ChatService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal) {

      config.max = 5;
    config.readonly = true;
    this.employees=[];
    this.scheduleInterviewData=new ScheduleInterviewModel();
    this.hireEmployeeFilters=new PublishJobModel();
     }

  ngOnInit() {
  }

  ScheduledInterview(emp:any)
  {
    const modalRef = this.modalService.open(ScheduledInterviewComponent);
    modalRef.componentInstance.emp=emp;  
    modalRef.componentInstance.status='schedule';      
    modalRef.componentInstance.direct_hire=true;  
    modalRef.componentInstance.projectId = this.projectId;
  }

  interviewletter(emp:any)
  {
    const modalRef = this.modalService.open(AppointmentLetterComponent,{
      size: 'lg',
      windowClass:'appoitmentmodel'
    });
    modalRef.componentInstance.emp=emp; 
    modalRef.componentInstance.letterFrom='directHire';  
    modalRef.componentInstance.projectId = this.projectId;
    modalRef.componentInstance.emitService.subscribe((emmitedValue) => {
         this.flagHired=emmitedValue;
         this.getNewEmpoloyeeList(1);
  });
  }

  getNewEmpoloyeeList(newPage) {
   //../employee-job-list/?professional_details__departments=1&professional_details__expertise=4&professional_details__role=2&professional_details__total_experience=2&professional_details__hourly_charges=2&availability_details__days_per_year=1&availability_details__hours_per_day=7
    if (newPage) {
      // this.recruitmentService.list(newPage, this.pageSize,this.stage,this.searchText)
      this.recruitmentService.directHireJobPostingList(newPage,this.pageSize,this.searchText, this.projectId)
      .subscribe((empJob:HireEmployeeModel[]) => {
          this.employees = empJob['results'];
          this.count = empJob['count'];
         // this.paginationReset = false;
        });
    }
  }

  rescheduleMyInterview(interviewData) {
    const modalRef = this.modalService.open(MyInterviewRescheduleComponent, {
      windowClass:'interviewmodel modal-dialog-centered'
    });
    modalRef.componentInstance.rescheduledata=interviewData;  
    modalRef.componentInstance.is_creator = true;
    modalRef.componentInstance.emitService.subscribe((emmitedValue) => {
      this.getNewEmpoloyeeList(1);
    });
  }

  ConfirmRescheduledInterview(interviewData) {
    interviewData.status = 'accept';
    this.interviewAppliedService.putRescheduleInterviewByCreator(interviewData).subscribe((response) => {
      this.getNewEmpoloyeeList(1);
      //location.reload();
    }, (errMsg) => {
      console.log(errMsg);
    });
  }

  valueChange()
  {
      if(this.searchText.length>2 || this.searchText=='')
      {
        this.getNewEmpoloyeeList(1);
      }
     
  }
  getProfile(empId:any)
  {    
      // this.router.navigate([empId, 'summary'], {relativeTo: this.route});
      //this.router.navigate(['profile'], {relativeTo: this.route});
      //this.router.navigate(['.', {idea: ideaId}, this.stage], {relativeTo: this.route.parent});
      //this.router.navigate(['founder/projects/'], {relativeTo: this.route});
      this.router.navigate(['founder/projects/'+this.projectId+'/recruitment/'+empId+'/profile']);
  }

  checkDocuSign(emp: any, template) {
    this.recruitmentService.getDocuSignStatus(emp.id, emp.offer_details.envelop).subscribe((obj)=>{
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
