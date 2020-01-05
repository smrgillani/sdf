import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms';
import { ForgotErrors } from './form-errors';
import * as moment from 'moment';
import { EmployeeBasicInfo } from 'app/employeeprofile/models/employee-basic-info';
import { StageStorage } from 'app/employeeprofile/stage-storage.service';
import { ListingData, SelectItem } from 'app/employeeprofile/models/employee-professional-info';  //'../employeeprofile/models/employee-professional-info';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeErrors } from '../form-errors';
//import { Subscription } from "rxjs/Subscription";
import { Observable } from 'rxjs/Observable';
import { AccountService } from '../../../../../founder/account/account.service';
import { ProfileMenuComponent } from '../../../../../core/navbar/profile-menu/profile-menu.component';
import UserProfileModel from 'app/core/models/UserProfileModel';
import { LoaderService } from 'app/loader.service';
//import { NavbarComponent } from 'app/employee/account/edit/stage/navbar/navbar.component';
import { environment } from 'environments/environment';
import { StageComponent } from '../stage.component';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss'],
  providers: [ProfileMenuComponent]
})
export class BasicInfoComponent implements OnInit {
  @Input() basicinfo: EmployeeBasicInfo;
  @ViewChild('f') public userFrm: NgForm;
  complexForm: FormGroup;
  messages: any;
  fields = null;
  date_of_birth: string;
  countryList: SelectItem[];
  stateList: SelectItem[];
  experienceList: SelectItem[];
  message: any;
  flagFromDate: boolean = false;
  profileErrors: object;
  processing = false;

  hobbiesSearch: string[] = [];
  searching = false;
  searchFailed = false;
  hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);
  cachedProfile: UserProfileModel;
  changeEmail = true;
  serverUrlToAppend: string = '';

  constructor(fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute, private stageStorage: StageStorage,
    private navbar: ProfileMenuComponent, private stageC: StageComponent,
    private loaderService: LoaderService, private cdRef: ChangeDetectorRef) {
    this.profileErrors = {};
    this.complexForm = fb.group({
      // To add a validator, we must first convert the string value into an array. The first item in the array is the default value if any, then the next item in the array is the validator. Here we are adding a required validator meaning that the firstName attribute must have a value in it.
      'first_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'date_of_birth': ['', [Validators.required]],
      'gender': [''],
      'photo': [''],
      'photo_bounds': [''],
      'photo_crop': [''],
      'marital_status': [''],
      'hobbies': [''],
      'address_line1': [''],
      'address_line2': [''],
      'city': [''],
      'state': [''],
      'country': [''],
      'pin_code': [''],
      'contact_details': [''],
      'alternate_contact_details': [''],
      'experience': [, Validators.required],
      'email': ['', [Validators.required, Validators.email]]
    });
    this.serverUrlToAppend = environment.server.replace('/api/v1', '');
  }

  ngOnInit() {
    this.messages = new EmployeeErrors();
    let _date = new Date();
    if (this.basicinfo.country != null) {
      this.getStateList(this.basicinfo.country);
    }


    this.stageStorage.getCountryList().subscribe(
      (obj: ListingData[]) => {
        this.countryList = [];
        obj.forEach(e => {
          this.countryList.push({
            id: e.id, label: e.title, value: e.id
          });
        });

      },
      (errorMsg: any) => {
        console.log(errorMsg);
      }
    );


    this.stageStorage.getTotalExperienceList().subscribe(
      (obj: ListingData[]) => {
        this.experienceList = [];
        obj.forEach(e => {

          this.experienceList.push({
            id: e.id, label: e.title, value: e.id
          });
        });

      },
      (errorMsg: any) => {
        console.log(errorMsg);
      }
    );

    if (!this.basicinfo) {
      this.basicinfo = new EmployeeBasicInfo();
    }
    this.changeEmail = !!this.basicinfo.email;

    this.complexForm.setValue({
      'first_name': this.basicinfo.first_name,
      'last_name': this.basicinfo.last_name,
      'date_of_birth': this.basicinfo.date_of_birth = this.basicinfo.date_of_birth != null && this.basicinfo.date_of_birth != undefined ? moment(this.basicinfo.date_of_birth).toDate() : new Date(),
      'photo': this.basicinfo.photo,
      'photo_bounds': this.basicinfo.photo_bounds,
      'photo_crop': this.basicinfo.photo_crop,
      'gender': this.basicinfo.gender = this.basicinfo.gender ? this.basicinfo.gender : 'male',
      'marital_status': this.basicinfo.marital_status = this.basicinfo.marital_status ? this.basicinfo.marital_status : 'single',
      'hobbies': this.basicinfo.hobbies,
      'address_line1': this.basicinfo.address_line1,
      'address_line2': this.basicinfo.address_line2,
      'city': this.basicinfo.city,
      'state': this.basicinfo.state,
      'country': this.basicinfo.country,
      'pin_code': this.basicinfo.pin_code,
      'contact_details': this.basicinfo.contact_details,
      'alternate_contact_details': this.basicinfo.alternate_contact_details,
      'experience': this.basicinfo.total_experience,
      'email': this.basicinfo.email ? this.basicinfo.email : ''
    })
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: any) {
    const key = event.target.name;
    if (key && this.profileErrors.hasOwnProperty(key)) {
      delete (this.profileErrors[key]);
    }
  }

  loadProfile(): void {
    this.stageStorage.getBasicInfo()
      .subscribe(
        (userProfile: EmployeeBasicInfo) => {
          if (userProfile.photo && userProfile.photo.indexOf('https') < 0) {
            userProfile.photo = `${this.serverUrlToAppend}${userProfile.photo}`;
          }
          this.basicinfo = userProfile;
        },
        (errorMsg: any) => {
          console.log(errorMsg);
        }
      );
  }
  edit(val) {
    this.getValues(val);
    this.router.navigate(['../photo'], { relativeTo: this.route });
  }
  onDOBChange(dob: Date) {
    this.basicinfo.date_of_birth = dob;
  }
  onStateSelect(_Id) {
    this.basicinfo.state = _Id;
  }

  onCountrySelect(_Id) {

    this.basicinfo.country = _Id;
    this.getStateList(this.basicinfo.country);
  }

  getStateList(_id) {
    this.stageStorage.getStateList(_id).subscribe(
      (obj: ListingData[]) => {
        this.stateList = [];
        obj.forEach(e => {

          this.stateList.push({
            id: e.id, label: e.title, value: e.id
          });
        });
      },
      (errorMsg: any) => {
        console.log(errorMsg);
      }
    );
  }

  getValues(value) {
    this.basicinfo.first_name = value.first_name
    this.basicinfo.last_name = value.last_name;
    this.basicinfo.date_of_birth = moment(value.date_of_birth).toDate();//this.basicinfo.date_of_birth;
    this.basicinfo.photo = this.basicinfo.photo;
    this.basicinfo.photo_bounds = this.basicinfo.photo_bounds;
    this.basicinfo.photo_crop = this.basicinfo.photo_crop;
    this.basicinfo.gender = value.gender;
    this.basicinfo.marital_status = value.marital_status;
    this.basicinfo.hobbies = value.hobbies;
    this.basicinfo.address_line1 = value.address_line1;
    this.basicinfo.address_line2 = value.address_line2;
    this.basicinfo.country = value.country;
    this.basicinfo.state = value.state;
    this.basicinfo.city = value.city;
    this.basicinfo.pin_code = value.pin_code;
    this.basicinfo.contact_details = value.contact_details;
    this.basicinfo.alternate_contact_details = value.alternate_contact_details;
    this.basicinfo.total_experience = value.experience;
    this.basicinfo.email = value.email;

    const basicinfomain: any = Object.assign({}, this.basicinfo);
    basicinfomain.date_of_birth = moment(this.basicinfo.date_of_birth).format('YYYY-MM-DD');

    //this.stageStorage.basicInfoDataSubcritption.next(this.basicinfo);
    this.stageStorage.setBasicInfo(basicinfomain);
  }
  submitBasicInfo(value: any) {
    if (this.stageC.getUserIdFromToken() !== this.basicinfo.userprofile_id) {
      this.stageC.invalidToken();
      return;
    }
    this.processing = true;
    if (this.complexForm.valid && !this.flagFromDate) {
      this.getValues(value);

      this.basicinfo.is_completed = true;

      const basicinfomain: any = Object.assign({}, this.basicinfo);
      basicinfomain.date_of_birth = moment(this.basicinfo.date_of_birth).format('YYYY-MM-DD');
      let contact_details: boolean = true;
      let alternate_contact_details: boolean = true;

      this.stageStorage.checkPhoneIsValid(basicinfomain.contact_details).subscribe((cd) => {
        contact_details = cd.valid;
        !cd.valid ? this.checkForErrors({'contact_details': ['Invalid Phone no.']}) : true;

        this.stageStorage.checkPhoneIsValid(basicinfomain.alternate_contact_details).subscribe((acd) => {
          alternate_contact_details = acd.valid;
          !acd.valid ? this.checkForErrors({'alternate_contact_details': ['Invalid Phone no.']}) : true;
          this.processing = false;
          if (alternate_contact_details && contact_details) {
            this.putBasicInfo(basicinfomain);
          }
        });
      });
    } else {
      this.processing = false;
      console.log("validation falied");
      this.validateAllFormFields(this.complexForm);
    }
  }

  putBasicInfo(basicinfomain: any) {
    this.stageStorage.putBasicInfo(basicinfomain).subscribe((obj) => {
      this.stageStorage.setBasicInfo(basicinfomain);
      this.processing = false;
      this.updateNavigationBar(basicinfomain);
      this.router.navigate(['../professionalinfo'], { relativeTo: this.route });
    },
      (errorMsg: any) => {
        this.checkForErrors(errorMsg);
        this.profileErrors = errorMsg;
        this.processing = false;
      }
    );
  }

  updateNavigationBar(basicinfomain) {

    this.accountService.cachedProfile.first_name = basicinfomain.first_name;
    this.accountService.cachedProfile.last_name = basicinfomain.last_name;
    this.accountService.cachedProfile.photo = basicinfomain.photo;
    this.accountService.cachedProfile.photo_bounds = basicinfomain.photo_bounds;
    this.accountService.cachedProfile.photo_crop = basicinfomain.photo_crop;
    this.accountService.cachedProfile.date_of_birth = basicinfomain.date_of_birth;
    this.accountService.cachedProfile.address = this.basicinfo.address_line1;
    this.accountService.cachedProfile.phone_number = this.basicinfo.contact_details;
    this.accountService.cachedProfile.zip = this.basicinfo.pin_code ? this.basicinfo.pin_code: null;
    this.accountService.profileUpdated.next(this.accountService.cachedProfile);
    this.navbar.ngOnInit();
  }
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched({ onlySelf: true });

    });
  }
  checkForErrors(errorMsg) {
    console.log('yakko errors',errorMsg);
    let newErr = {};
    Object.keys(errorMsg).forEach((err) => {
      newErr[err] = true;
      this.complexForm.controls[err] ? this.complexForm.controls[err].setErrors(newErr)
        : this.complexForm.controls['common'].setErrors(newErr);

      console.log(this.complexForm.controls[err].errors[err]);
    });

  }

  checkFromDate(from) {
    let _today = new Date();
    if (moment(from.inputFieldValue).toDate() > _today) {
      this.flagFromDate = true;
    }
    else {
      this.flagFromDate = false;
    }
  }

  selectAddress(event) {
    event.preventDefault();
    this.basicinfo.address_line1 = event.item.address;
    this.basicinfo.pin_code = event.item.postal_code;
    this.complexForm.controls['address_line1'].setValue(event.item.address);
    this.complexForm.controls['pin_code'].setValue(event.item.postal_code);
  }

  addressFormatter = (result: object) => result;

  searchAddress = (text$: Observable<string>) => {

    return text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>
        this.accountService.getAddress(term)
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          }))
      .do(() => this.searching = false)
      .merge(this.hideSearchingWhenUnsubscribed);
  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

}
