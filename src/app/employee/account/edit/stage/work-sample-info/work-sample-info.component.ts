import { Component, OnInit } from '@angular/core';

import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms'
import { StageStorage } from 'app/employeeprofile/stage-storage.service';
import {EmployeeWorkSampleInfo} from 'app/employeeprofile/models/employee-work-sample-info';
import {ListingData} from 'app/employeeprofile/models/employee-professional-info';  //'../employeeprofile/models/employee-professional-info';
import * as moment from 'moment';
import {SelectItem} from 'app/employeeprofile/models/employee-professional-info';
import {Router,ActivatedRoute} from '@angular/router';
import { EmployeeEmploymentInfo } from 'app/employeeprofile/models/employee-employment-info';
import {DropdownModule,CalendarModule,MultiSelectModule,ConfirmDialogModule,ConfirmationService} from 'primeng/primeng';
import { LoaderService } from 'app/loader.service';
import { StageComponent } from '../stage.component';

@Component({
  selector: 'app-work-sample-info',
  templateUrl: './work-sample-info.component.html',
  styleUrls: ['./work-sample-info.component.scss']
})
export class WorkSampleInfoComponent implements OnInit {
  complexForm: FormGroup;
  messages: any;
  fields = null;
  private workSampleInfo:EmployeeWorkSampleInfo;

   roleList:SelectItem[];
   teamList:SelectItem[];        //ListingData[];
    arrayWorkSampleInfo:EmployeeWorkSampleInfo[]=[];
    flagToDate:boolean=false;
    flagFromDate:boolean=false;
    processing = false;

  constructor(fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private stageStorage:StageStorage,
    private confirmationService: ConfirmationService,
    private loaderService: LoaderService,
    private stageC: StageComponent) {
    this.workSampleInfo=new EmployeeWorkSampleInfo();
    this.complexForm = fb.group({
      'tempId':[''],
      'id':[''],
      'client': [''],
      'project_title': [''],
      'from_date': ['', [Validators.required]],
      'to_date': ['', [Validators.required]],
      'project_details': [''],
      'employment_type': [''],
      'role':[],
      'role_description':[''],
      'team_size': [],
      'skill_used': ['']
    });
  }
  ngOnInit() {
    this.stageStorage.getWorkDetails().subscribe(
      (obj: EmployeeWorkSampleInfo[]) => {
       if(obj!=undefined  && obj.length>0)
        {
          this.arrayWorkSampleInfo=obj;
        }
        else{
          this.arrayWorkSampleInfo=[];
        }
        this.setValues();
      },
      (errorMsg: any) => {
        console.log(errorMsg);
      }
    );

    this.stageStorage.getRoleList().subscribe(
      (obj: ListingData[]) => {

        this.roleList=[];
        obj.forEach(e=>{
          this.roleList.push({

            id: e.id, label: e.title, value: e.id
          });
        });

      },
      (errorMsg: any) => {
        console.log(errorMsg);
      }
    );



    this.stageStorage.getTeamList().subscribe(
      (obj: ListingData[]) => {
        this.teamList=[];
        obj.forEach(e=>{

          this.teamList.push({
            //label as well as value should have same value
            id: e.id, label: e.title, value: e.id
          });
        });

      },
      (errorMsg: any) => {
        console.log(errorMsg);
      }
    );

  }

  editData(_data)
  {

    this.workSampleInfo=_data;

    this.setValues();

  }
  setValues()
  {

    let _date = new Date();

    this.complexForm.setValue({
     'tempId':this.workSampleInfo.tempId = (this.workSampleInfo.tempId != undefined && this.workSampleInfo.tempId != null) ? this.workSampleInfo.tempId : this.getRandomInt(100,200),
      'id': this.workSampleInfo.id = (this.workSampleInfo.id != undefined && this.workSampleInfo.id != null) ? this.workSampleInfo.id : -1,
     'client': this.workSampleInfo.client = this.workSampleInfo.client != undefined && this.workSampleInfo.client != null ? this.workSampleInfo.client : null,
      'project_title':this.workSampleInfo.project_title= this.workSampleInfo.project_title != undefined && this.workSampleInfo.project_title != null ? this.workSampleInfo.project_title : null,

      'from_date':this.workSampleInfo.from_date= this.workSampleInfo.from_date != undefined && this.workSampleInfo.from_date != null ? moment(this.workSampleInfo.from_date).toDate():  new Date(),
      'to_date':this.workSampleInfo.to_date= this.workSampleInfo.to_date != undefined && this.workSampleInfo.to_date != null ? moment(this.workSampleInfo.to_date).toDate():  new Date(),
      'project_details':this.workSampleInfo.project_details= this.workSampleInfo.project_details != undefined && this.workSampleInfo.project_details != null ? this.workSampleInfo.project_details : null,
      'employment_type':this.workSampleInfo.employment_type= this.workSampleInfo.employment_type != undefined && this.workSampleInfo.employment_type != null ? this.workSampleInfo.employment_type : 'permanent',

      'role':this.workSampleInfo.role=this.workSampleInfo.role != undefined && this.workSampleInfo.role != null ? this.workSampleInfo.role : [],

      'role_description':this.workSampleInfo.role_description= this.workSampleInfo.role_description != undefined && this.workSampleInfo.role_description != null ? this.workSampleInfo.role_description : null,
     'team_size': this.workSampleInfo.team_size= this.workSampleInfo.team_size != undefined && this.workSampleInfo.team_size != null ? this.workSampleInfo.team_size : null,
      'skill_used':this.workSampleInfo.skill_used= this.workSampleInfo.skill_used != undefined && this.workSampleInfo.skill_used != null ? this.workSampleInfo.skill_used : null,
    })
   }



    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

  submitWorkInfo(value: any) {
    if (this.stageC.getUserIdFromToken() !== this.stageStorage.employeeInfo.basicInfo.userprofile_id) {
      this.stageC.invalidToken();
      return;
    }
    this.processing=true;
    if (this.validateWorkSampleInfo()) {
      this.setFormValidators();
    } else {
      this.unsetFormValidators();
    }

    if(this.complexForm.valid && !this.flagFromDate && !this.flagToDate)
    {
    this.getValues(value);

    //check for workSampleInfo !=undefine then only push
    if(this.workSampleInfo.client!=undefined)
    {
    const workSampleInfoMain: any = Object.assign({}, this.workSampleInfo);
    workSampleInfoMain.from_date = moment(this.workSampleInfo.from_date).format('YYYY-MM-DD');
    workSampleInfoMain.to_date = moment(this.workSampleInfo.to_date).format('YYYY-MM-DD');

    // if id not present in array then post else put
    let index = this.arrayWorkSampleInfo.findIndex(a=>a.id==this.workSampleInfo.id  && a.tempId==this.workSampleInfo.tempId);
    if(index > -1)
    {
      this.arrayWorkSampleInfo[index]=workSampleInfoMain;   //this.workSampleInfo;
       this.workSampleInfo=new EmployeeWorkSampleInfo();
         this.resetForm();

    }

    else
    {
      this.arrayWorkSampleInfo.push(workSampleInfoMain);
      this.workSampleInfo=new EmployeeWorkSampleInfo();

      this.resetForm();
    }
  }
// need to iterate on array and if id present then put else post
    this.stageStorage.postWorkInfo(this.arrayWorkSampleInfo).subscribe((obj)=>{
            this.stageStorage.setWorkSampleInfo(this.arrayWorkSampleInfo);
            this.processing=false;
            this.router.navigate(['../availabilityinfo'], {relativeTo: this.route});
            }    ,
            (errorMsg: any) => {
              this.processing=false;
              console.log(errorMsg);
              this.arrayWorkSampleInfo=[];
              this.checkForErrors(errorMsg);
            });

  }
  else{
    this.processing=false;
    this.validateAllFormFields(this.complexForm);

  }
}

    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
        const control = formGroup.get(field);
        control.markAsTouched({ onlySelf: true });
        });
    }

    checkForErrors(errorMsg) {
      let newErr = {};
      Object.keys(errorMsg).forEach((err) => {
        newErr[err] = true;
        this.complexForm.controls[err] ? this.complexForm.controls[err].setErrors(newErr)
          : this.complexForm.controls['common'].setErrors(newErr);

          console.log(this.complexForm.controls[err].errors[err]);
      });

    }

  getValues(value)
  {
    if(value.client!=null)
    {
    this.workSampleInfo.tempId=value.tempId;
    this.workSampleInfo.id=value.id;
    this.workSampleInfo.client=value.client;
    this.workSampleInfo.project_title=value.project_title;
    this.workSampleInfo.from_date= moment(value.from_date).toDate();
    this.workSampleInfo.to_date= moment(value.to_date).toDate();
    this.workSampleInfo.project_details=value.project_details;
    this.workSampleInfo.employment_type=value.employment_type;
    this.workSampleInfo.role=value.role;
    this.workSampleInfo.role_description=value.role_description;

    this.workSampleInfo.team_size=value.team_size;
    this.workSampleInfo.skill_used=value.skill_used;
    this.workSampleInfo.is_completed = true;
    }
    else
    {
      this.workSampleInfo=new EmployeeWorkSampleInfo();
    }
  }
  addMore(_val)
  {
    this.setFormValidators();
    if(this.complexForm.valid && !this.flagFromDate && !this.flagToDate)
    {
    this.getValues(_val);


    //check for workSampleInfo !=undefine then only push
    if(this.workSampleInfo.client!=undefined)
    {
    const workSampleInfoMain: any = Object.assign({}, this.workSampleInfo);
    workSampleInfoMain.from_date = moment(this.workSampleInfo.from_date).format('YYYY-MM-DD');
    workSampleInfoMain.to_date = moment(this.workSampleInfo.to_date).format('YYYY-MM-DD');

       // if id not present in array then post else put
       let index = this.arrayWorkSampleInfo.findIndex(a=>a.id==this.workSampleInfo.id  && a.tempId==this.workSampleInfo.tempId);
       if(index > -1)
       {
         this.arrayWorkSampleInfo[index]=workSampleInfoMain;   //this.workSampleInfo;
          this.workSampleInfo=new EmployeeWorkSampleInfo();
           //this.complexForm.reset();
           this.resetForm();
       }
       else
       {
         this.arrayWorkSampleInfo.push(workSampleInfoMain);
         this.workSampleInfo=new EmployeeWorkSampleInfo();
         this.resetForm();
       }
      }
  }
  else{
    this.validateAllFormFields(this.complexForm);
  }
}

  resetForm()
  {
    this.workSampleInfo=new EmployeeWorkSampleInfo();
    this.complexForm.reset();
    this.complexForm.controls['id'].setValue(-1);
    this.complexForm.controls['tempId'].setValue(this.getRandomInt(100,200));
    this.complexForm.controls['employment_type'].setValue('permanent');
    this.complexForm.controls['from_date'].setValue(new Date());
    this.complexForm.controls['to_date'].setValue(new Date());
  }

  deleteRecord(rec)
  {
    if(rec.id!=-1)
    {
        this.stageStorage.deleteWorkSample(rec).subscribe((obj)=>{
          console.log(obj);
        }  ,
        (errorMsg: any) => {
          console.log(errorMsg);
        });
    }
      //remove this rec from array
     let index=this.arrayWorkSampleInfo.findIndex(a=>a.id== rec.id && a.tempId==rec.tempId);
      this.arrayWorkSampleInfo.splice(index,1);
  }

  confirm(rec) {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to delete this record?',
        accept: () => {
            //Actual logic to perform a confirmation
            this.deleteRecord(rec);
        }
    });
}

  onTeamSelect(_Id)
  {
    for (var i = 0; i < this.teamList.length; i++)
    {
      if (this.teamList[i].id == _Id) {
        this.workSampleInfo.team_size=_Id;
      }
    }
  }


  checkDateValidation(from,to)
  {
    if(moment(from.inputFieldValue).toDate() > moment(to.inputFieldValue).toDate())
    {
      this.flagToDate=true;
    }
    else
    {
      this.flagToDate=false;
    }
    let _today=new Date();
    if(moment(from.inputFieldValue).toDate() > _today)
    {
      this.flagFromDate=true;
    }
    else
    {
      this.flagFromDate=false;
    }
  }

  validateWorkSampleInfo () : boolean {
    if (this.arrayWorkSampleInfo == undefined || this.arrayWorkSampleInfo.length == 0 || this.anyFieldSet()) {
      return true;
    } else {
      return false;
    }
  }

  anyFieldSet() : boolean
  {
    if (this.complexForm.value.client || this.complexForm.value.project_title ||
    this.complexForm.value.project_details || (this.complexForm.value.role !== null && this.complexForm.value.role.length > 0) ||
    this.complexForm.value.role_description || this.complexForm.value.team_size ||
    this.complexForm.value.skill_used) {
      return true;
    } else {
      return false;
    }
  }

  setFormValidators() : void {
    this.complexForm.controls['client'].setValidators(Validators.required);
    this.complexForm.controls['client'].updateValueAndValidity();

    this.complexForm.controls['project_details'].setValidators(Validators.required);
    this.complexForm.controls['project_details'].updateValueAndValidity();

    this.complexForm.controls['project_title'].setValidators(Validators.required);
    this.complexForm.controls['project_title'].updateValueAndValidity();

    this.complexForm.controls['role'].setValidators(Validators.required);
    this.complexForm.controls['role'].updateValueAndValidity();
  }

  unsetFormValidators() : void {
    this.complexForm.controls['client'].setValidators(null);
    this.complexForm.controls['client'].updateValueAndValidity();

    this.complexForm.controls['project_details'].setValidators(null);
    this.complexForm.controls['project_details'].updateValueAndValidity();

    this.complexForm.controls['project_title'].setValidators(null);
    this.complexForm.controls['project_title'].updateValueAndValidity();

    this.complexForm.controls['role'].setValidators(null);
    this.complexForm.controls['role'].updateValueAndValidity();
  }

}
