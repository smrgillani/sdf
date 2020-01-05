import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { StageStorage } from 'app/employeeprofile/stage-storage.service';
import { EmployeeAvailabilityInfo } from 'app/employeeprofile/models/employee-availability-info';
import { ListingData, SelectItem } from 'app/employeeprofile/models/employee-professional-info';
import { Router, ActivatedRoute } from '@angular/router';
import { StageComponent } from '../stage.component';

@Component({
  selector: 'app-availability-info',
  templateUrl: './availability-info.component.html',
  styleUrls: ['./availability-info.component.scss'],
})
export class AvailabilityInfoComponent implements OnInit {
  complexForm: FormGroup;
  daysPerYearList: SelectItem[];
  hoursPerDay: SelectItem[];
  hourly_chargesList: SelectItem[];
  processing = false;
  private availabilityInfo: EmployeeAvailabilityInfo = new EmployeeAvailabilityInfo();

  constructor(
    fb: FormBuilder,
    private router: Router,
    private stageC: StageComponent,
    private route: ActivatedRoute, private stageStorage: StageStorage,
  ) {
    this.complexForm = fb.group({
      'daysPerYear': [''],
      'hoursPerDay': [''],
      'hourly_charges': [''],
    });
  }

  ngOnInit() {
    this.stageStorage.getAvailabilityDetails().subscribe(
      (obj: EmployeeAvailabilityInfo) => {
        if (obj !== undefined) {
          this.availabilityInfo = obj;
        } else {
          this.availabilityInfo = new EmployeeAvailabilityInfo();
        }
        this.setValues();
      },
      (errorMsg: any) => {
        console.log(errorMsg);
      },
    );

    this.stageStorage.getDaysPerYearList().subscribe(
      (obj: ListingData[]) => {
        this.daysPerYearList = [];
        obj.forEach(e => {
          this.daysPerYearList.push({
            id: e.id, label: e.title, value: e.id,
          });
        });
      },
      (errorMsg: any) => {
        console.log(errorMsg);
      },
    );

    this.stageStorage.getHourlyBudgetList().subscribe(
      (obj: ListingData[]) => {
        this.hourly_chargesList = [];
        obj.forEach(e => {

          this.hourly_chargesList.push({
            id: e.id, label: e.title, value: e.id,
          });
        });
      },
      (errorMsg: any) => {
        console.log(errorMsg);
      },
    );

    // set hoursPerDay
    this.stageStorage.getAllAvailability().subscribe(
      (obj: ListingData[]) => {
        this.hoursPerDay = [];
        obj.forEach(e => {

          this.hoursPerDay.push({
            id: e.id, label: e.title, value: e.id,
          });
        });
      },
      (errorMsg: any) => {
        console.log(errorMsg);
      },
    );
  }

  submitAvailabilityInfo(value: any) {
    if (this.stageC.getUserIdFromToken() !== this.stageStorage.employeeInfo.basicInfo.userprofile_id) {
      this.stageC.invalidToken();
      return;
    }
    this.processing = true;
    if (this.complexForm.valid) {
      this.availabilityInfo.days_per_year = value.daysPerYear;
      this.availabilityInfo.hours_per_day = value.hoursPerDay;
      this.availabilityInfo.hourly_charges = value.hourly_charges;
      this.availabilityInfo.is_completed = true;
      this.stageStorage.putAvailabilityInfo(this.availabilityInfo).subscribe((obj) => {
          this.stageStorage.setAvailabilityInfo(this.availabilityInfo);
          this.processing = false;
          this.router.navigate(['../../'], {relativeTo: this.route});
        },
        (errorMsg: any) => {
          this.processing = false;
          console.log(errorMsg);
        });
    } else {
      this.processing = false;
      console.log('validation falied');
      this.validateAllFormFields(this.complexForm);
    }
  }

  private setValues() {
    this.complexForm.setValue({
      'daysPerYear': this.availabilityInfo.days_per_year,
      'hoursPerDay': this.availabilityInfo.hours_per_day,
      'hourly_charges': this.availabilityInfo.hourly_charges,
    });
  }

  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched({onlySelf: true});
    });
  }
}
