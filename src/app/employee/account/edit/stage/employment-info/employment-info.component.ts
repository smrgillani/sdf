import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ConfirmationService } from 'primeng/primeng';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { StageStorage } from 'app/employeeprofile/stage-storage.service';
import { EmployeeEmploymentInfo } from 'app/employeeprofile/models/employee-employment-info';
import { ListingData } from 'app/employeeprofile/models/employee-professional-info';
import * as moment from 'moment';
import { SelectItem } from 'app/employeeprofile/models/employee-professional-info';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { getElement } from 'wijmo/wijmo';
import { Calendar } from 'wijmo/wijmo.input';
import { StageComponent } from '../stage.component';

@Component({
  selector: 'app-employment-info',
  templateUrl: './employment-info.component.html',
  styleUrls: ['./employment-info.component.scss'],
})
export class EmploymentInfoComponent implements OnInit, AfterViewInit {
  complexForm: FormGroup;
  roleList: SelectItem[];
  departmentList: SelectItem[];
  functionalAreaList: SelectItem[];
  arrayEmploymentInfo: EmployeeEmploymentInfo[] = [];
  flagToDate = false;
  flagFromDate = false;
  processing = false;
  searching = false;
  searchFailed = false;
  private employmentInfo = new EmployeeEmploymentInfo();
  private hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);

  constructor(
    fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private stageStorage: StageStorage,
    private confirmationService: ConfirmationService,
    private stageC: StageComponent,
  ) {
    this.complexForm = fb.group({
      'id': [''],
      'current_employer': [''],
      'current_designation': [''],
      'date_start': ['', [Validators.required]],
      'date_end': ['', [Validators.required]],
      'job_role': [''],
      'functional_areas': [],
      'role': [],
      'departments': [],
      'tempId': [''],
      'present': [''],
    });
  }

  ngOnInit() {
    this.stageStorage.getEmploymentDetails().subscribe(
      (obj: EmployeeEmploymentInfo[]) => {
        if (obj !== undefined && obj.length > 0) {
          this.arrayEmploymentInfo = obj;
        } else {
          this.arrayEmploymentInfo = [];
        }
        this.setValues();
      },
      (errorMsg: any) => {
        console.log(errorMsg);
      },
    );

    this.stageStorage.getRoleList().subscribe(
      (obj: ListingData[]) => {
        this.roleList = [];
        obj.forEach(e => {
          this.roleList.push({
            id: e.id, label: e.title, value: e.id,
          });
        });
      },
      (errorMsg: any) => {
        console.log(errorMsg);
      },
    );

    this.stageStorage.getDepartmentList().subscribe(
      (obj: ListingData[]) => {
        this.departmentList = [];
        obj.forEach(e => {
          this.departmentList.push({
            id: e.id, label: e.title, value: e.id,
          });
        });
      },
      (errorMsg: any) => {
        console.log(errorMsg);
      },
    );

    this.stageStorage.getFunctionalAreaList().subscribe(
      (obj: ListingData[]) => {
        this.functionalAreaList = [];
        obj.forEach(e => {
          this.functionalAreaList.push({
            id: e.id, label: e.title, value: e.id,
          });
        });
      },
      (errorMsg: any) => {
        console.log(errorMsg);
      },
    );
  }

  ngAfterViewInit(): void { }

  submitEmploymentInfo(_val) {
    if (this.stageC.getUserIdFromToken() !== this.stageStorage.employeeInfo.basicInfo.userprofile_id) {
      this.stageC.invalidToken();
      return;
    }
    this.processing = true;

    if (this.validateEmploymentInfo()) {
      this.complexForm.controls['current_employer'].setValidators(Validators.required);
      this.complexForm.controls['current_employer'].updateValueAndValidity();
      console.log('Employment Form Valid');
    } else {
      this.complexForm.controls['current_employer'].setValidators(null);
      this.complexForm.controls['current_employer'].updateValueAndValidity();
      console.log('Employment Form Invalid');
    }

    if (this.complexForm.valid && !this.flagFromDate && !this.flagToDate) {
      console.log('Employment form all is good.');
      this.getValues(_val);

      if (this.employmentInfo.current_employer !== undefined) {
        const employmentInfoMain: any = Object.assign({}, this.employmentInfo);
        employmentInfoMain.date_start = moment(this.employmentInfo.date_start).format('YYYY-MM-DD');
        const fromYear = this.employmentInfo.date_start.getFullYear();
        if (this.employmentInfo.present) {
          employmentInfoMain.date_end = moment(new Date()).format('YYYY-MM-DD');
          employmentInfoMain.duration = fromYear.toString() + '-Present';
        } else {
          employmentInfoMain.date_end = moment(this.employmentInfo.date_end).format('YYYY-MM-DD');
          employmentInfoMain.duration = fromYear.toString() + '-' + this.employmentInfo.date_end.getFullYear().toString();
        }

        const index = this.arrayEmploymentInfo.findIndex(a => a.id === this.employmentInfo.id && a.tempId === this.employmentInfo.tempId);

        if (index > -1) {
          this.arrayEmploymentInfo[index] = employmentInfoMain;
          this.employmentInfo = new EmployeeEmploymentInfo();

        } else {
          this.arrayEmploymentInfo.push(employmentInfoMain);
          this.employmentInfo = new EmployeeEmploymentInfo();
        }
      }

      this.stageStorage.postEmploymentInfo(this.arrayEmploymentInfo).subscribe(obj => {
          this.stageStorage.setEmploymentInfo(this.arrayEmploymentInfo);
          this.processing = false;
          this.resetForm();
          this.router.navigate(['../worksampleinfo'], {relativeTo: this.route});
        },
        (errorMsg: any) => {
          this.processing = false;
          console.log(errorMsg);
          // this.arrayEmploymentInfo = [];
          this.checkForErrors(errorMsg);
        });
    } else {
      this.processing = false;
      console.log('submitEmploymentInfo validation failed');
      this.validateAllFormFields(this.complexForm);
    }
  }

  addMore(_val) {
    const employmentInfoMain: any = Object.assign({}, this.employmentInfo);
    employmentInfoMain.date_start = moment(this.employmentInfo.date_start).format('YYYY-MM-DD');

    this.complexForm.controls['current_employer'].setValidators(Validators.required);
    this.complexForm.controls['current_employer'].updateValueAndValidity();

    if (this.complexForm.valid && !this.flagFromDate && !this.flagToDate) {
      this.getValues(_val);

      if (this.employmentInfo.current_employer != undefined) {
        const employmentInfoMain: any = Object.assign({}, this.employmentInfo);

        employmentInfoMain.date_start = moment(this.employmentInfo.date_start).format('YYYY-MM-DD');
        const fromYear = this.employmentInfo.date_start.getFullYear();

        if (this.employmentInfo.present) {
          employmentInfoMain.date_end = moment(new Date()).format('YYYY-MM-DD');
          employmentInfoMain.duration = fromYear.toString() + '-Present';
        } else {
          employmentInfoMain.date_end = moment(this.employmentInfo.date_end).format('YYYY-MM-DD');
          employmentInfoMain.duration = fromYear.toString() + '-' + this.employmentInfo.date_end.getFullYear().toString();
        }

        const index = this.arrayEmploymentInfo.findIndex(a => a.id === this.employmentInfo.id && a.tempId === this.employmentInfo.tempId);

        if (index > -1) {
          this.arrayEmploymentInfo[index] = employmentInfoMain;
          this.employmentInfo = new EmployeeEmploymentInfo();
          this.resetForm();
        } else {
          this.arrayEmploymentInfo.push(employmentInfoMain);
          this.employmentInfo = new EmployeeEmploymentInfo();
          this.resetForm();
        }
      }
    } else {
      console.log('addMore validation failed');
      this.validateAllFormFields(this.complexForm);
    }
  }

  resetForm() {
    this.employmentInfo = new EmployeeEmploymentInfo();

    this.complexForm.reset();
    this.complexForm.controls['id'].setValue(-1);
    this.complexForm.controls['tempId'].setValue(this.getRandomInt(100, 200));
    this.complexForm.controls['job_role'].setValue('permanent');
    this.complexForm.controls['date_start'].setValue(new Date());
    this.complexForm.controls['present'].setValue(false);
    this.complexForm.controls['date_end'].setValue(new Date());
  }

  editData(_data) {
    this.employmentInfo = _data;
    this.setValues();
  }

  onCheckedItemChanged(value: boolean, from) {
    const _today = new Date();

    if (moment(from.inputFieldValue).toDate() > _today) {
      this.flagFromDate = true;
    } else {
      this.flagFromDate = false;
      this.employmentInfo.present = value;
    }

    if (value) {
      this.complexForm.controls['date_end'].setValue(new Date());
    }
  }

  checkDateValidation(from, to) {
    this.flagToDate = moment(from.inputFieldValue).toDate() > moment(to.inputFieldValue).toDate();
    const _today = new Date();
    this.flagFromDate = moment(from.inputFieldValue).toDate() > _today || this.flagToDate;

    console.log('this.flagToDate:', this.flagToDate);
    console.log('this.flagFromDate:', this.flagFromDate);
  }

  onFunctionalSelect(_Id) {
    this.employmentInfo.functional_areas = _Id;
    for (let i = 0; i < _Id.length; i++) {
      const fieldName = this.functionalAreaList.filter(a => a.id === _Id[i]).map(b => b.label)[0];
      this.employmentInfo.functional_areas_name[i] = fieldName;
    }
  }

  onRoleSelect(_Id) {
    this.employmentInfo.role = _Id;
    for (let i = 0; i < _Id.length; i++) {
      const fieldName = this.roleList.filter(a => a.id === _Id[i]).map(b => b.label)[0];
      this.employmentInfo.role_name[i] = fieldName;
    }
  }

  onDepartmentSelect(_Id) {
    this.employmentInfo.departments = _Id;
    for (let i = 0; i < _Id.length; i++) {
      const fieldName = this.departmentList.filter(a => a.id === _Id[i]).map(b => b.label)[0];
      this.employmentInfo.departments_name[i] = fieldName;
    }
  }

  confirm(rec) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this record?',
      accept: () => {
        // Actual logic to perform a confirmation
        this.deleteRecord(rec);
      },
    });
  }

  validateEmploymentInfo(): boolean {
    return this.arrayEmploymentInfo === undefined || this.arrayEmploymentInfo.length === 0 || this.anyFieldSet();
  }

  selectEmployer(event) {
    event.preventDefault();
    this.complexForm.controls['current_employer'].setValue(event.item.employer);
  }

  searchEmployer = (text$: Observable<string>) => {
    return text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>
        this.stageStorage.searchEmployer(term)
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          }))
      .do(() => this.searching = false)
      .merge(this.hideSearchingWhenUnsubscribed);
  }

  private setValues() {
    this.complexForm.setValue({
      'tempId': this.employmentInfo.tempId = (this.employmentInfo.tempId != undefined && this.employmentInfo.tempId != null) ? this.employmentInfo.tempId : this.getRandomInt(100, 200),
      'id': this.employmentInfo.id = this.employmentInfo.id != undefined && this.employmentInfo.id != null ? this.employmentInfo.id : -1,
      'current_employer': this.employmentInfo.current_employer = this.employmentInfo.current_employer != undefined && this.employmentInfo.current_employer != null ? this.employmentInfo.current_employer : null,
      'current_designation': this.employmentInfo.current_designation = this.employmentInfo.current_designation != undefined && this.employmentInfo.current_designation != null ? this.employmentInfo.current_designation : '',
      'date_start': this.employmentInfo.date_start = this.employmentInfo.date_start != undefined && this.employmentInfo.date_start != null ? moment(this.employmentInfo.date_start).toDate() : new Date(),
      'date_end': this.employmentInfo.date_end = this.employmentInfo.date_end != undefined && this.employmentInfo.date_end != null ? moment(this.employmentInfo.date_end).toDate() : new Date(),
      'job_role': this.employmentInfo.job_role = this.employmentInfo.job_role != undefined && this.employmentInfo.job_role != null ? this.employmentInfo.job_role : 'permanent',
      'functional_areas': this.employmentInfo.functional_areas = this.employmentInfo.functional_areas != undefined && this.employmentInfo.functional_areas != null ? this.employmentInfo.functional_areas : [],
      'role': this.employmentInfo.role = this.employmentInfo.role != undefined && this.employmentInfo.role != null ? this.employmentInfo.role : [],
      'departments': this.employmentInfo.departments = this.employmentInfo.departments != undefined && this.employmentInfo.departments != null ? this.employmentInfo.departments : [],
      'present': this.employmentInfo.present,
    });
  }

  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched({onlySelf: true});
    });
  }

  private checkForErrors(errorMsg) {
    const newErr = {};
    Object.keys(errorMsg).forEach((err) => {
      newErr[err] = true;
      // this.complexForm.controls[err] ? this.complexForm.controls[err].setErrors(newErr)
      //   : this.complexForm.controls['common'].setErrors(newErr);

      console.log(this.complexForm.controls[err].errors[err]);

      console.log('this.complexForm.controls:', this.complexForm.controls);
    });
  }

  private getValues(value) {
    if (value.current_employer != null) {
      this.employmentInfo.id = value.id;
      this.employmentInfo.tempId = value.tempId;
      this.employmentInfo.current_employer = value.current_employer;
      this.employmentInfo.current_designation = value.current_designation;
      this.employmentInfo.date_start = moment(value.date_start).toDate();
      this.employmentInfo.date_end = moment(value.date_end).toDate();
      this.employmentInfo.functional_areas = value.functional_areas;
      this.employmentInfo.job_role = value.job_role;
      this.employmentInfo.role = value.role;
      this.employmentInfo.departments = value.departments;
      this.employmentInfo.present = value.present;
      this.employmentInfo.is_completed = true;
    } else {
      this.employmentInfo = new EmployeeEmploymentInfo();
    }
  }

  private getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private deleteRecord(rec) {
    if (rec.id !== -1) {
      this.stageStorage.deleteEmployment(rec).subscribe((obj) => {

        },
        (errorMsg: any) => {
          console.log(errorMsg);
        });
    }
    const index = this.arrayEmploymentInfo.findIndex(a => a.id === rec.id && a.tempId === rec.tempId);
    this.arrayEmploymentInfo.splice(index, 1);
  }

  private anyFieldSet(): boolean {
    return !!(this.complexForm.value.current_employer || this.complexForm.value.current_designation ||
      (this.complexForm.value.functional_areas !== null && this.complexForm.value.functional_areas.length > 0) ||
      (this.complexForm.value.role !== null && this.complexForm.value.role.length > 0) ||
      (this.complexForm.value.departments !== null && this.complexForm.value.departments.length > 0));
  }
}
