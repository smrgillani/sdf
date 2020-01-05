import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/merge';

import { AccountService } from '../account.service';
import { AuthService } from 'app/auth/auth.service';
import UserProfileModel from 'app/core/models/UserProfileModel';
import Roles from 'app/core/models/Roles.enum';
import { ProfileEditSession } from './ProfileEditSession';
import { FirstLastNameErrors } from './form-errors';
import { ChangePasswordModel } from 'app/core/models/ChangePasswordModel';
import { debug } from 'util';
import { LoaderService } from 'app/loader.service';
import { SelectItem } from 'primeng/primeng';
import { environment } from 'environments/environment';
import { SetPasswordModel } from '../../../core/models/set-password-model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RateSlabComponent } from 'app/founder/order-service/rate-slab/rate-slab.component';
import { DeletePromptComponent } from 'app/elements/delete-prompt/delete-prompt.component';
import { InfoPromptComponent } from 'app/elements/info-prompt/info-prompt.component';
import { JwtHelper } from 'angular2-jwt';

@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditAccountComponent implements OnInit {
  @ViewChild('f') public userFrm: NgForm;

  private profile: UserProfileModel;
  private objChangePassword: ChangePasswordModel;
  private objSetPassword: SetPasswordModel;
  private readonly jwtHelper: JwtHelper = new JwtHelper();
  // private userRoles;

  profileErrors: object;
  isTemporaryUser: boolean;
  messages: any;

  fields = null;

  searching = false;
  searchFailed = false;
  changeEmail = true;
  changePhone = true;
  changeUsername = true;

  hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);
  flagShowPassword: boolean = false;
  flagShowSetPassword: boolean = false;

  // flagPasswordReq: boolean = false;
  // flagOldPassword: boolean = false;
  // flagPasswordMismach: boolean = false;
  // flagOldPasswordReq: boolean = false;
  notImplementedMessage: string;
  userRoles: SelectItem[];
  flagFromDate: boolean = false;
  serverUrlToAppend: string = '';
  isCountryUS:boolean = true;

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private profileEditSession: ProfileEditSession,
    private router: Router,
    private formBuilder: FormBuilder, private loaderService: LoaderService,
    private modalService: NgbModal,
  ) {
    this.isTemporaryUser = authService.isTemporaryUser();
    this.profile = new UserProfileModel();
    this.profileErrors = {};
    this.userRoles = [];
    this.objChangePassword = new ChangePasswordModel();
    this.objSetPassword = new SetPasswordModel();
    this.notImplementedMessage = 'This features are not yet implemented';
    this.serverUrlToAppend = environment.server.replace('/api/v1', '');
    _.values(Roles).forEach(e => {
      this.userRoles.push({
        label: e, value: e
      });
    });
  }

  ngOnInit() {
    this.messages = new FirstLastNameErrors();
    Object.keys(this.userFrm.controls).forEach((control) => {
      this.userFrm.controls[control].setErrors(null);
    });
    this.loadProfile();
  }

  /**
   * Callback called after new photo was chosen
   */
  imageChangeListener($event, document: string) {
    this.profile[document] = $event.src;
    document == 'driver_license_photo' || document == 'driver_license_back_photo' ? this.profile.is_dlverify = false : document == 'passport_photo' ? this.profile.is_passportverify = false : true
  }

  submitForm(event) {
    this.userFrm.ngSubmit.emit();
    if (this.userFrm.valid) {
      this.saveUser(event);
    } else {
      this.fields = this.userFrm.controls;
    }
  }


  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: any) {
    const key = event.target.name;
    if (key && this.profileErrors.hasOwnProperty(key)) {
      delete (this.profileErrors[key]);
    }
  }

  loadProfile(): void {
    this.profileEditSession.getUser()
      .subscribe(
        (userProfile: UserProfileModel) => {
          if (userProfile.photo && userProfile.photo.indexOf('https') < 0) {
            userProfile.photo = `${this.serverUrlToAppend}${userProfile.photo}`;
          }
          if (userProfile.passport_photo && userProfile.passport_photo.indexOf('https') < 0) {
            userProfile.passport_photo = `${this.serverUrlToAppend}${userProfile.passport_photo}`;
          }
          if (userProfile.driver_license_photo && userProfile.driver_license_photo.indexOf('https') < 0) {
            userProfile.driver_license_photo = `${this.serverUrlToAppend}${userProfile.driver_license_photo}`;
          }
          if (userProfile.driver_license_back_photo && userProfile.driver_license_back_photo.indexOf('https') < 0) {
            userProfile.driver_license_back_photo = `${this.serverUrlToAppend}${userProfile.driver_license_back_photo}`;
          }

          this.profile = userProfile;
          userProfile.date_of_birth ? this.profile.date_of_birth = moment(userProfile.date_of_birth).toDate() : '';
          this.profile.is_dlverify = userProfile.is_dlverify;
          this.profile.is_passportverify = userProfile.is_passportverify;
          this.changeEmail = !!userProfile.email;
          this.changePhone = !!userProfile.phone_number;
          this.changeUsername = !!userProfile.user_name;
          if(userProfile.registration_country && userProfile.registration_country.title)
          {
            this.isCountryUS = userProfile.registration_country.title!=='United Kingdom';
          }
        },
        (errorMsg: any) => {
          console.log(errorMsg);
        }
      );
  }

  saveUser(event): void {
    if (this.getUserIdFromToken() !== this.profile.id) {
      this.invalidToken();
      return;
    }
    this.accountService.checkPhoneIsValid(this.profile.phone_number).subscribe((obj) => {
      if (obj.valid) {
        if (!this.profile.phone_number) {
          this.profile.is_2FA_Phone = false;
        }
        if (!this.profile.email) {
          this.profile.is_2FA_Email = false;
        }
        this.accountService.updateProfile(this.profile)
          .subscribe(
            () => {
              // FIXME: fix static route
              this.router.navigate(['/founder/account']);
            },
            (errorMsg: any) => {
              console.log(errorMsg);
              this.profileErrors = errorMsg;
              this.checkForErrors(errorMsg);
            });
      }
      else {
        let errorMsg = { 'phone_number': ['Enter a valid phone number.'] };
        this.checkForErrors(errorMsg);
        this.profileErrors = errorMsg;
      }
    });

  }

  selectAddress(event) {
    event.preventDefault();
    this.profile.address = event.item.address;
    this.profile.zip = event.item.postal_code;
    // changes related to allow spaces in zip code as per client requirement
    //if(this.profile.zip && this.profile.zip.length>0)
    //{
    //  this.profile.zip = this.profile.zip.replace(' ','');
    //}
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

  removeID(ID: string) {
    //to delete uploaded ID/Photo
    if (ID == 'passport_photo') {
      this.profile.passport_photo = '';
    }
    if (ID == 'driver_license_photo') {
      this.profile.driver_license_photo = '';
    }
  }

  showChangePassword() {
    this.flagShowPassword = true;
  }

  changePassword() {
    this.objChangePassword.id = this.profile.id;
    this.accountService.changePassword(this.objChangePassword)
      .subscribe(
        (response: string) => {
          this.flagShowPassword = false;
          this.declinePassword();
        },
        (errMsg: any) => {
          this.profileErrors = errMsg;
          console.log(errMsg);
        }
      );
  }

  showSetPassword() {
    this.flagShowSetPassword = true;
  }

  setPassword() {
    this.objSetPassword.id = this.profile.id;
    this.accountService.setPassword(this.objSetPassword)
      .subscribe(
        (response) => {
          console.log(response);
          this.declineSetPassword();
          this.accountService.cachedProfile.is_social_login = undefined;// = new UserProfileModel();
          this.loadProfile();
        },
        (errMsg: any) => {
          this.profileErrors = errMsg;
          console.log(errMsg);
        });
  }

  declineSetPassword() {
    this.removeErrors('password1');
    this.removeErrors('password2');
    this.objSetPassword = new SetPasswordModel();
    this.flagShowSetPassword = false;
  }

  removeErrors(key) {
    //const key = event.target.name;
    if (key && this.profileErrors.hasOwnProperty(key)) {
      delete (this.profileErrors[key]);
    }
  }

  declinePassword() {
    this.removeErrors('new_password1');
    this.removeErrors('new_password2');
    this.removeErrors('old_password');
    this.objChangePassword = new ChangePasswordModel();
    this.flagShowPassword = false;

    // this.flagOldPassword = false;
    // this.flagOldPasswordReq = false;
    // this.flagPasswordReq = false;
    // this.flagPasswordMismach = false;
  }

  checkForErrors(errorMsg) {
    let newErr = {};
    Object.keys(errorMsg).forEach((err) => {
      newErr[err] = true;
      this.userFrm.controls[err] ? this.userFrm.controls[err].setErrors(newErr)
        : '';//this.userFrm.controls['common'].setErrors(newErr);
      console.log(this.userFrm.controls[err].errors[err]);
    });
  }

  isArray(errors){
    return Array.isArray(errors);
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

  ssnPopUp(id: number) {
    const modalRef = this.modalService.open(InfoPromptComponent, {
      size: 'lg',
      windowClass: 'appoitmentmodel',
    });
    modalRef.componentInstance.id = id;
  }

  getUserIdFromToken() {
    const jwt = localStorage.getItem('token');
    const jwtDetails = this.jwtHelper.decodeToken(jwt);
    const userID = jwtDetails.user_id;
    return userID;
  }

  invalidToken() {
    console.log('InvalidToekn >>> Going to clear cache and Logout');
    localStorage.removeItem('currentRole');
    localStorage.removeItem('userCountry');
    localStorage.removeItem('userCountryName');
    localStorage.removeItem('keepMeLoggedIn');
    this.accountService.clearProfileCache();
    this.router.navigateByUrl('/login');

    this.accountService.signOut().subscribe(() => {
      this.authService.logout();
    });
  }
}
