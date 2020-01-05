import { Component, OnInit, Input, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { LoginService, TokenResponse } from 'app/auth/login.service';
import { LoginRequest } from 'app/auth/models/LoginRequest';
import { CommonResponse } from 'app/core/api/CommonResponse';
import { AuthService } from 'app/auth/auth.service';
import { SignupService } from 'app/auth/signup.service';
import UserProfileModel from 'app/core/models/UserProfileModel';
import { RoleService } from 'app/core/role.service';
import Roles from 'app/core/models/Roles.enum';
import { TermsOfUseContent } from '../terms-of-use/terms-of-use.component';
import { LoginErrors } from './form-errors';
import { LoaderService } from 'app/loader.service';
import { SelectItem } from 'primeng/primeng';
import { UserCountryService } from 'app/core/user-country.service';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    '~@angular/material/prebuilt-themes/pink-bluegrey.css',
    './login.component.scss',
    './login.component.portrait.css'
  ],
  providers: [LoginService, SignupService]
})
export class LoginComponent implements OnInit {
  private loginForm: FormGroup;
  private callback = false;
  popUpOptions: NgbModalOptions = { backdrop: false, windowClass: 'center-position  top50', size: 'lg' };
  showOtpInput = false;
  //Testing SVN
  messages: any;
  fields = null;
  //msgs: any[] = [];
  loginMethod: SelectItem[];
  idMethods: SelectItem[];
  idlognpprocess: boolean = false;
  isStage: string = 'startup';
  id_number: string;

  identifier: string;
  identifierData: string;
  otp: string;
  private otpForm: FormGroup;
  otpError: boolean = false;
  capsOn: boolean = false;
  displayCapsWarning: boolean = false;
  keepMeLoggedIn: boolean = true;
  hide:boolean = true;
  foods: any = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  @Input() title;
  constructor(
    private route: ActivatedRoute,
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private roleService: RoleService,
    private userCountryService: UserCountryService,
    private signupService: SignupService,
    private modalService: NgbModal,
    private loaderService: LoaderService
  ) {
    this.loginForm = formBuilder.group({
      method: ['email', []],
      common: ['', []],
      email: ['', []],
      phone: ['', []],
      idproof: ['', []],
      password: ['', []],
      username: ['', []],
      otp: ['', []],
      idmethod: ['passport', []]
    });
    this.loginMethod = [
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'phone' },
      { label: 'User Name', value: 'username' },
      { label: 'ID Proof', value: 'idproof' }
    ];
    this.idMethods = [
      { label: 'Please Select', value: null },
      { label: 'Passport', value: 'passport' },
      { label: 'Driving License', value: 'driving_license' }
    ];

    this.otpForm = formBuilder.group({
      otp: ['', []]
    });
  }

  ngOnInit() {
    localStorage.clear();
    this.authService.logout();
    this.messages = new LoginErrors();
    console.log(this.messages);
    this.route.queryParams.subscribe((params: Params) => {
      const token = params['token'];
      const oauth_token = params['oauth_token'];
      const oauth_verifier = params['oauth_verifier'];
      const isPaypal = params['paypal'];
      const email = params['email'];
      const isError = params['is_error'];
      const errorMsg = params['error'];

      console.log(`ispaypal - ${isPaypal}, email - ${email}`);

      if (token) {
        this.authService.login(token);
        this.callback = true;
        this.getUserStatus();
      }
      if (isPaypal) {
        if (isError) {
          //this.msgs.push({ severity: 'error', summary: 'Error', detail: errorMsg, life: 3000 });
        }
        else {
          this.getPaypalData(email);
        }
      }
      else if (oauth_token && oauth_verifier) {
        this.getTwitterData(oauth_token, oauth_verifier);
      }
    });

    this.loginForm.valueChanges.subscribe((e) => {
      this.loginForm.controls['common'].setErrors(null);
    });
  }

  getPaypalData(email: string) {
    let response = new LoginRequest();
    response.email = email;
    this.loginService.socialLogin(response)
      .subscribe(
        (response: TokenResponse) => {
          this.authService.login(response.token);
          // TODO: get user info
          const user = {} as UserProfileModel;
          this.navigateToNext(user);
        }
      );
  }

  getTwitterData(oauth_token: string, oauth_verifier: string) {
    this.loginService.getTwitterData(oauth_token, oauth_verifier)
      .subscribe((response: LoginRequest) => {
        this.loginService.socialLogin(response)
          .subscribe(
            (response: TokenResponse) => {
              this.authService.login(response.token);
              // TODO: get user info
              const user = {} as UserProfileModel;
              this.navigateToNext(user);
            }
          );
      });
  }

  openPrivacyPolicyModal() {
    const modalRef = this.modalService.open(TermsOfUseContent, this.popUpOptions);
    modalRef.componentInstance.title = 'Privacy Policy';
  }

  openTermsOfUseModal() {
    const modalRef = this.modalService.open(TermsOfUseContent, this.popUpOptions);
    modalRef.componentInstance.title = 'Terms of Use';
  }

  removeErrors(value) {
    this.fields = [];
    Object.keys(this.loginForm.controls).forEach((control) => {
      if (control !== 'method') {
        this.loginForm.controls[control].patchValue('');
      }
      this.loginForm.controls[control].setErrors(null);
    });
  }

  submitOtp() {
    this.otpError = false;
    this.fields = this.otpForm.controls;
    const data = this.otpForm.value;
    if (this.otpForm.valid) {
      this.loaderService.loaderStatus.next(true);
      console.log('proceed to get token after otp verification');
      // const otpData :{ email: string, otp: number } = { email: this.identifier, otp: +data.OTP };
      const otpData: { email: string, phone: string, user_name: string,id_number:string, dl_number:string, otp: number } = { email: null, phone: null, user_name: null, id_number:null, dl_number:null, otp: +data.otp };
      if (this.identifier === 'email') {
        otpData.email = this.identifierData;
      }
      else if (this.identifier === 'phone') {
        otpData.phone = this.identifierData;
      }
      else if (this.identifier === 'user_name') {
        otpData.user_name = this.identifierData;
      }
      else if (this.identifier === 'id_number') {
        otpData.id_number = this.identifierData;
      }
      else if (this.identifier === 'dl_number') {
        otpData.dl_number = this.identifierData;
      }

      this.loginService.otpLogin(otpData)
        .subscribe((response) => {
          console.log(response);
          this.authService.login(response.token);
          this.loaderService.loaderStatus.next(false);
          // TODO: get user info
          const user = {} as UserProfileModel;
          this.navigateToNext(user);
        }, (errorMsg: any) => {
          console.log(errorMsg);
          this.otpError = true;
          this.loaderService.loaderStatus.next(false);
        });
    }
  }

  loginUser() {
    this.loaderService.loaderStatus.next(true);
    this.fields = this.loginForm.controls;
    const data = this.loginForm.value;
    const loginData: LoginRequest =
      data.method === 'email' && { email: data.email, password: data.password } ||
      //data.method === 'phone' && {phone: data.phone, password: data.otp};
      data.method === 'phone' && { phone: data.phone, password: data.password } ||
      data.method === 'username' && { user_name: data.username, password: data.password } ||
      data.method === 'idproof' && { id_number: data.idmethod == 'passport' ? data.idproof : undefined, dl_number: data.idmethod != 'passport' ? data.idproof : undefined, password: '123' };// needs to get alternative to the hard code password.

    if (data.method === 'idproof') { this.loginForm.controls['email'].setErrors(null); this.loginForm.controls['idproof'].setErrors(null); this.loginForm.controls['password'].setErrors(null); };

    if (this.loginForm.valid) {
      // if(data.method==='email')
      // {
      if (data.method === 'phone') {
        this.loginService.checkPhoneIsValid(data.phone).subscribe((res) => {
          if (!res.valid) {
            this.checkForErrors({ 'phone': ['Invalid Phone no.'] });
          }
          else {
            this.getLogInToken(loginData);
          }
        });
      }
      else {
        this.getLogInToken(loginData);
      }
    }
    else {
      this.loaderService.loaderStatus.next(false);
      // this.msgs.push({ severity: 'error', summary: 'Something went wrong', detail: 'Sorry', life: 3000 });
    }
  }

  getLogInToken(loginData: LoginRequest) {
    this.loginService.login(loginData)
      .subscribe(
        (response: TokenResponse) => {
          console.log('TokenResponse:', response);

          if (this.keepMeLoggedIn) { localStorage.setItem('keepMeLoggedIn', 'true'); }
          else { localStorage.removeItem('keepMeLoggedIn'); }

          this.authService.login(response.token);
          this.loaderService.loaderStatus.next(false);
          // TODO: get user info
          const user = {} as UserProfileModel;
          this.navigateToNext(user);
        },
        (errorMsg: any) => {
          console.log(errorMsg);
          if (errorMsg.otpRequired && errorMsg.otpRequired[0]) {
            this.showOtpInput = true;
            if (errorMsg.email) {
              this.identifier = 'email';
              this.identifierData = errorMsg.email[0];
            }
            else if (errorMsg.phone) {
              this.identifier = 'phone';
              this.identifierData = errorMsg.phone[0];
            }
            else if (errorMsg.user_name) {
              this.identifier = 'user_name';
              this.identifierData = errorMsg.user_name[0];
            }
            else if (errorMsg.id_number) {
              this.idlognpprocess = false;
              this.identifier = 'id_number';
              this.identifierData = errorMsg.id_number[0];
            }
            else if (errorMsg.dl_number) {
              this.idlognpprocess = false;
              this.identifier = 'dl_number';
              this.identifierData = errorMsg.dl_number[0];
            }
            this.loaderService.loaderStatus.next(false);
          }
          else {
            this.checkForErrors(errorMsg);
          }
        }
      );
  }

  sendCode() {
    this.loaderService.loaderStatus.next(true);
    console.log('proceed to get token after otp verification');
    // const otpData :{ email: string, otp: number } = { email: this.identifier, otp: +data.OTP };
    const otpData: { email: string, phone: string, user_name: string,id_number:string, dl_number:string } = { email: null, phone: null, user_name: null,id_number:null, dl_number:null };
    if (this.identifier === 'email') {
      otpData.email = this.identifierData;
    }
    else if (this.identifier === 'phone') {
      otpData.phone = this.identifierData;
    }
    else if (this.identifier === 'user_name') {
      otpData.user_name = this.identifierData;
    }
    else if (this.identifier === 'id_number') {
      otpData.id_number = this.identifierData;
    }
    else if (this.identifier === 'dl_number') {
      otpData.dl_number = this.identifierData;
    }

    this.loginService.resendOTP(otpData).subscribe((data) => {
      console.log('resend otp', data);
      this.loaderService.loaderStatus.next(false);
    }, (errorMsg: any) => {
      console.log(errorMsg);
      this.loaderService.loaderStatus.next(false);
    });
  }

  getUserStatus() {
    this.loginService.getLoginStatus().subscribe(
      (response: CommonResponse) => {
        console.log(response);
        if (response.success === true) {
          const user = response.data as UserProfileModel;
          this.navigateToNext(user);
          return;
        } else {
          const error = response.error;
          if (error.message !== undefined) {
            alert(error.message);
          }
        }
        this.callback = false;
      },
      (errorMsg: any) => {
        console.log(errorMsg);
        this.callback = false;
      }
    );
  }

  checkForErrors(errorMsg) {
    this.loaderService.loaderStatus.next(false);
    let newErr = {};
    Object.keys(errorMsg).forEach((err) => {
      newErr[err] = true;
      this.loginForm.controls[err] ? this.loginForm.controls[err].setErrors(newErr)
        : this.loginForm.controls['common'].setErrors(newErr);
    });
    //this.msgs.push({ severity: 'error', summary: '  went wrong', detail: 'Sorry', life: 3000 });
  }

  navigateToNext(user: UserProfileModel) {
    // this.loaderService.loaderStatus.next(false);
    //this.msgs.push({ severity: 'success', summary: 'Login Successfully Done', detail: 'Welcome', life: 3000 });
    this.userCountryService.getUserCountry()
    .subscribe((data) => {
        if (!data) {
          this.router.navigate(['/country']);
        }
        else {
          this.roleService.getPrimaryRole()
          .subscribe((role: Roles) => {
            if (role) {
              this.roleService.setCurrentRole(role);
              // this.loaderService.loaderStatus.next(false);
              this.router.navigate([this.roleService.getCurrentHome()]);
            } else {
              this.loaderService.loaderStatus.next(false);
              this.router.navigate(['/role']);
            }
          });
        }
      }, (error) => {
        console.log('Error while fetching the user country', error);
        this.userCountryService.setUserCountryIntoLocal(null,null);
        return false;
      });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: any) {
    this.capsOn = event.getModifierState && event.getModifierState('CapsLock');
  }

  keydown(event:any) {
    this.displayCapsWarning = event.getModifierState && event.getModifierState('CapsLock')
  }

  focus(event:any) {
    this.displayCapsWarning = this.capsOn;
  }

  blur(event:any) {
    this.displayCapsWarning = false;
  }

  getidstage(event) {
    if (event) {
      //this.isStage = 'completeState';
      //this.idlognpprocess=false;
      this.loginUser();
    }
  }

  passwordVisibilityClick(event: Event) {
    event.preventDefault();
  }
}
