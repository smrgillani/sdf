import { Component, OnInit, OnDestroy, Injectable, HostListener, Input } from '@angular/core';
import { PublishJobModel } from 'app/projects/models/PublishJobModel';
import { RecruitmentService } from 'app/projects/recruitment.service';
import { Subscription } from "rxjs/Subscription";
import { Ng2DatetimePickerModule } from 'ng2-datetime-picker';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { CalendarModule } from 'primeng/primeng';
import * as moment from 'moment';
import { flattenStyles } from '@angular/platform-browser/src/dom/dom_renderer';
import { ListingData, SelectItem } from 'app/employeeprofile/models/employee-professional-info';

//import { window } from 'rxjs/operator/window';

//import { FormGroup, FormBuilder, Validators, FormsModule, AbstractControlDirective } from '@angular/forms';

//import {NgbDateAdapter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
//import {NgbDateAdapter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
// @Injectable()
// export class NgbDateNativeAdapter extends NgbDateAdapter<Date> {

//     fromModel(date: Date): NgbDateStruct {
//       return (date && date.getFullYear) ? {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()} : null;
//     }

//     toModel(date: NgbDateStruct): Date {
//       return date ? new Date(Date.UTC(date.year, date.month - 1, date.day)) : null;
//     }
//   }
@Component({
  selector: 'app-post-job',
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.scss']
  // providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}]
})

export class PostJobComponent implements OnInit, OnDestroy {
  // model1: Date;
  // model2: Date; 
  // model;
  //private postJobForm: FormGroup;
  private publishJobModelData: PublishJobModel;
  flagTitleReq: boolean = false;
  flagDescReq: boolean = false;
  flagPublish: boolean = false;
  flagUnPublish: boolean = false;
  //cur_date:Date;
  _publishJobModelDataSubscription: Subscription = new Subscription();
  jobList: PublishJobModel[] = [];
  _jobListAll: any;    //PublishJobModel[]=[];
  status = 'publish';

  flagToDate: boolean = false;
  flagFromDate: boolean = false;
  flagDepartment: boolean = false;
  flagRole: boolean = false;
  filteropen: boolean = true;
  jobposting: boolean = true;
  @Input() projectId: number;
  publishTypeList: SelectItem[];

  constructor(private recruitmentService: RecruitmentService
    //,private formBuilder: FormBuilder
  ) {
    this.publishJobModelData = new PublishJobModel();
    // this.postJobForm = formBuilder.group({
    //   method: ['email', []],
    //   common: ['', []],
    //   title:['',[]],
    //   description:['',[]]      
    // });
  }

  @HostListener("window:resize", [])
  onWindowResize() {
    // this.kyb_left_height();
    if (window.innerWidth < 768) {
      this.filteropen = false;
      this.jobposting = false;
    }
    else {
      this.filteropen = true;
      this.jobposting = true;
    }
  }
  @HostListener("window:scroll", [])
  onWindowScroll() {

  }

  //  get today() {
  //   return new Date();
  // }

  ngOnInit() {

    this.publishJobModelData.date_start = new Date();
    this.publishJobModelData.date_end = new Date();
    this.publishTypeList = [];
    this.publishTypeList.push({
      id: 1, label: "Published", value: "publish"
    },
      {
        id: 2, label: "Unpublished", value: "unpublish"
      });

    this._publishJobModelDataSubscription = this.recruitmentService.publishJobModelData
      .subscribe(
      (obj) => {

        if (obj != undefined) {
          //obj.date_start.toDateString()           
          this.publishJobModelData = obj;
          this.publishJobModelData.date_start = moment(this.publishJobModelData.date_start).toDate();
          this.publishJobModelData.date_end = moment(this.publishJobModelData.date_end).toDate();
          this.publishJobModelData.project = this.projectId;
          if (this.publishJobModelData.status == 'publish') {
            this.flagPublish = true;
            this.flagUnPublish = false;
          }
          if (this.publishJobModelData.status == 'unpublish') {
            this.flagUnPublish = true;
            this.flagPublish = false;
          }
          if (this.publishJobModelData.title != null || this.publishJobModelData.description != null) {
            this.flagTitleReq = false;
            this.flagDescReq = false;
          }
          //this.getData();
        }
        this.getList(this.status);
      }
      );
    // this.getList(this.status);
    //this.recruitmentService.publishJobModelData.next(this.publishJobModelData);

    if (window.innerWidth < 768) {
      this.filteropen = false;
      this.jobposting = false;
    }
    else {
      this.filteropen = true;
      this.jobposting = true;
    }
  }
  filteropenpanel() {
    if (window.innerWidth < 768) {
      this.filteropen = !this.filteropen;
    }
  }
  postingopenpanel() {
    if (window.innerWidth < 768) {
      this.jobposting = !this.jobposting;
    }
  }
  cancel() {
    this.flagPublish = false;
    this.flagUnPublish = false;
    this.resetFlags();
    this.clearData();
  }
  checkDateValidation(from, to) {
    // if(_val.from_date>_val.to_date)
    if (moment(from.inputFieldValue).toDate() > moment(to.inputFieldValue).toDate()) {
      this.flagToDate = true;
    }
    else {
      this.flagToDate = false;
      // this.flagFromDate=false;
    }
  }
  resetFlags() {
    this.flagTitleReq = false;
    this.flagDescReq = false;
    this.flagDepartment = false;
    this.flagRole = false;
  }
  // checkFromDate(from)
  // {
  //   let _today=new Date();
  //   if(moment(from.inputFieldValue).toDate() > _today)
  //   {
  //     this.flagFromDate=true;
  //   }
  //   else
  //   {
  //     this.flagFromDate=false;       
  //   } 
  // }
  checkValidation() {
    this.resetFlags();
    if (this.publishJobModelData.title == undefined && this.publishJobModelData.title == null) {
      this.flagTitleReq = true;
    }
    if (this.publishJobModelData.description == undefined && this.publishJobModelData.description == null) {
      this.flagDescReq = true;
    }
    if (this.publishJobModelData.department.length == 0) {
      this.flagDepartment = true;
    }
    if (this.publishJobModelData.role.length == 0) {
      this.flagRole = true;
    }
  }

  publish() {

    this.checkValidation();
    const publishJobModelDataMain: any = Object.assign({}, this.publishJobModelData);
    publishJobModelDataMain.date_start = moment(this.publishJobModelData.date_start).format('YYYY-MM-DD');
    publishJobModelDataMain.date_end = moment(this.publishJobModelData.date_end).format('YYYY-MM-DD');
    publishJobModelDataMain.project = this.projectId;
    // if(this.publishJobModelData.title!=undefined && this.publishJobModelData.title!=null)
    // {    
    //   this.flagTitleReq=false;
    //   this.flagDescReq=false;

    if (this.flagTitleReq || this.flagDescReq || this.flagDepartment || this.flagRole) {
      console.log('Please fill required fields');

    }
    else {
      publishJobModelDataMain.status = 'publish';

      this.recruitmentService.publishJob(publishJobModelDataMain)
        .subscribe(
        (response: string) => {
          this.clearData();
        },
        (errMsg: any) => {
          console.log('recruitmentService.publishJob errMsg: ', errMsg);
          
          try {
            if (errMsg['non_field_errors'][0] == 'Please select start date less than end date') {
              this.flagToDate = true;
            }
          } catch (e) {
              console.log('recruitmentService.publishJob catch: ', e);
          }
        });
    }
    //  else{
    //   this.flagTitleReq=true;
    //   this.flagDescReq=true;
    //  }
  }
  updateWithStatus(updateStatus: string) {
    this.checkValidation();
    const publishJobModelDataMain: any = Object.assign({}, this.publishJobModelData);
    publishJobModelDataMain.date_start = moment(this.publishJobModelData.date_start).format('YYYY-MM-DD');
    publishJobModelDataMain.date_end = moment(this.publishJobModelData.date_end).format('YYYY-MM-DD');
    publishJobModelDataMain.project = this.projectId;
    // if(this.publishJobModelData.title!=undefined && this.publishJobModelData.title!=null)
    // {    
    //   this.flagTitleReq=false;
    //   this.flagDescReq=false;
    publishJobModelDataMain.status = updateStatus;
    this.recruitmentService.updatePublishJob(publishJobModelDataMain)
      .subscribe(
      (response: string) => {
        this.clearData();
        this.flagPublish = false;
        this.flagUnPublish = false;
      },
      (errMsg: any) => {
        console.log(errMsg);
      }
      );
    // }
    //  else{
    //   this.flagTitleReq=true;
    //   this.flagDescReq=true;
    //  }
  }

  clearData() {

    this.publishJobModelData = new PublishJobModel();
    this.recruitmentService.publishJobModelData.next(this.publishJobModelData);
    this.recruitmentService.postJobClear.next(true);
  }
  ngOnDestroy() {
    this._publishJobModelDataSubscription.unsubscribe();
  }

  onListSelect(_status: string) {
    this.status = _status;
    this.getList(this.status);

  }
  getList(status: string) {
    this.recruitmentService.getJobList(this.projectId)
      .subscribe(
      (obj: PublishJobModel) => {
        if (obj != undefined) {
          this._jobListAll = obj;
          this.jobList = this._jobListAll.filter(a => a.status == status);
        }
      },
      (errMsg: any) => {
        console.log(errMsg);
      }
      );
  }

  getSelectedJob(job: any) {
    //this.publishJobModelData=job;
    this.recruitmentService.publishJobModelData.next(job);
    this.recruitmentService.flagGetJobDetails.next(true);
  }
}
