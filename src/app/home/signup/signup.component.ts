import { Location } from '@angular/common';
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, AbstractControlDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from 'app/auth/auth.service';
import { LoginService, TokenResponse } from 'app/auth/login.service';
import { SignupService } from 'app/auth/signup.service';
import UserProfileModel from 'app/core/models/UserProfileModel';

import { TermsOfUseContent } from '../terms-of-use/terms-of-use.component';
import { SignUpErros } from './form-errors';
import { query } from '@angular/core/src/animation/dsl';
import Question from 'app/questionnaire/models/Question';
import {SelectItem} from 'primeng/primeng';
import { CapturedInfo } from 'app/core/models/id-sign-up-model';
import { HostListener } from '@angular/core';
interface idMethod {
  label: string;
  value: string;
}
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: [
    '~@angular/material/prebuilt-themes/pink-bluegrey.css',
    './signup.component.scss',
    './signup.component.portrait.css'
  ],
  providers: [SignupService, LoginService]
})

export class SignupComponent implements OnInit {
  @Input() title;

  signupForm: FormGroup;
  popUpOptions: NgbModalOptions = { backdrop: false, windowClass: 'center-position top50', size: 'lg' };
  showOtpInput = false;
  question: string;
  question_id: any;
  question_type: string;
  listValue: any; // =[{"key": "m","value":"Male"},{"key":"f","value":"Female"},{"key":"o","value":"Other"}];
  checkboxValues: string[] = []; //=[{"key": "m","value":"ck_Male"},{"key":"f","value":"ck_Female"},{"key":"o","value":"ck_Other"}];
  messages: any;
  fields = null;
  tempAnswer: string[] = [];
  msgArray = [];
  isStage:string='getIdStage';
  idMethods: idMethod[];
  singnUpMethod: SelectItem[];
  idsignupprocess:boolean=false;
  capturedInfo: CapturedInfo;
  objKeyMessage: any;
  capsOn: boolean = false;
  displayCapsWarning: boolean = false;
  hide: boolean = true;

  constructor(
    private router: Router,
    private signupService: SignupService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private loginService: LoginService,
    private _location: Location,
    private modalService: NgbModal
  ) {
    this.signupForm = formBuilder.group({
      method: ['email', []],
      common: ['', []],
      email: ['', []],
      phone: ['', []],
      idproof: ['', []],
      password: ['', []],
      otp: ['', []],
      username: ['', []],
      question: ['', []],
      answer: ['', []],
      idmethod:['passport', []]
    });
    this.singnUpMethod = [
      {label: 'Email', value: 'email'},
      {label: 'Phone', value: 'phone'},
      {label: 'User Name', value: 'username'},
      {label: 'ID Proof', value: 'idproof'},
  ];
  this.idMethods = [
    {label: 'Please Select', value: null},
    {label: 'Passport', value: 'passport'},
    {label: 'Driving License', value: 'driving_license'},
    //{label: 'ID', value: 'otherid'},
];

this.capturedInfo = new CapturedInfo();

  }
  ngOnInit() {
    this.messages = new SignUpErros;
    this.signupForm.valueChanges.subscribe((e) => {
      this.signupForm.controls['common'].setErrors(null);
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

  get showJoinButton() {
    const method = this.signupForm.value.method;
    if (method === 'email') {
      return true;
    } else if (method === 'phone') {
      return this.showOtpInput;
    }
    if (method === 'username') {
      return true;
    }
    if (method === 'idproof') {
      return this.showOtpInput;
    }
    return false;
  }

  removeErrors(value) {
    const method = this.signupForm.value.method;
    this.fields = [];
    this.capturedInfo = new CapturedInfo();
    Object.keys(this.signupForm.controls).forEach((control) => {
      if(control!=='method'){
        this.signupForm.controls[control].patchValue('');
      }
      this.signupForm.controls[control].setErrors(null);
    });
    if (method === 'username') {

      this.signupService.getQuestion().subscribe(
        (Que: any) => {
          this.question = Que.title;
          this.question_id = Que.id;
          this.question_type = Que.question_type;
          this.listValue = Que.vals;
        },
        (errorMsg: any) => {
          console.log(errorMsg);
        }
      );
    }
    if (method === 'idproof') {
      this.objKeyMessage = {};
      this.isStage = 'getIdStage';
    }
  }

  registerUser() {
    this.fields = this.signupForm.controls;
    this.objKeyMessage = {};
    this.signupForm.value.method === 'idproof' ? this.signupForm.controls['email'].setErrors(null) : '';
    if (this.signupForm.valid) {
      const method: string = this.signupForm.value.method;
      const password: string = this.signupForm.value.password;

      //ading fields for User name
      //const question:string =this.signupForm.value.question;
      //const security_question=this.question;
      //Returning Question Id as security_question requested by Backend developer
      const security_question: number = this.question_id;
      if (this.question_type === 'checkboxes') {
        this.tempAnswer = this.checkboxValues;
      }
      else {
        //this is for question_type other than checkboxes
        this.tempAnswer = this.signupForm.value.answer;
      }
      const answer = this.tempAnswer;
      if (method === 'email') {
        const email: string = this.signupForm.value.email;
        this.signupService.signupWithEmail({ email, password })
          .flatMap((response: UserProfileModel) => {
            return this.loginService.login({ email, password });
          })
          .subscribe(this.onLogin, this.onLoginError);
      } else if (method === 'phone') {
        const phone: string = this.signupForm.value.phone;
        const otp: string = this.signupForm.value.otp;
        this.loginService.login({ phone, password: otp })
          .subscribe(this.onLogin, this.onLoginError);
      }
      else if (method === 'username') {
        const user_name: string = this.signupForm.value.username;
        this.signupService.signupWithUsername({ user_name, password, security_question, answer })
          .flatMap((response: UserProfileModel) => {
            return this.loginService.login({ user_name, password });
          })
          .subscribe(this.onLogin, this.onLoginError);

      } else if (method === 'idproof') {
        this.capturedInfo.password = this.signupForm.value.password;
        const id_number: string = this.capturedInfo.id_number;
        this.signupService.signupWithIdProof(this.capturedInfo)
          .flatMap((response: UserProfileModel) => {
            return this.loginService.login({ id_number , password });
          })
          .subscribe(this.onLogin, this.onLoginError);
      }
    }
  }

  checkForErrors(errorMsg) {
    this.msgArray = [];
    let newErr = {};
    this.objKeyMessage = errorMsg;
    Object.keys(errorMsg).forEach((err) => {
      const value = errorMsg[err];
      this.msgArray.push(value[0]);
      newErr[err] = true;
      console.log(errorMsg);
      err == 'phone' ? this.messages['phone'] = value[0]: '';
      this.signupForm.controls[err] ? this.signupForm.controls[err].setErrors(newErr)
        : this.signupForm.controls['common'].setErrors(newErr);
    });
  }

  sendCode() {
    const phone: string = this.signupForm.value.phone;
    const password: string = this.signupForm.value.password;
    this.fields = { phone: this.signupForm.controls['phone'], password: this.signupForm.controls['password'] };
    if (!this.signupForm.controls['phone'].value) this.signupForm.controls['phone'].setErrors({ required: true });

    this.signupService.checkPhoneIsValid(phone).subscribe((response: any) => {
      if(response.valid) {
        this.signupService.signupWithPhone({ phone, password })
        .subscribe(
          (response: any) => {
            console.log(`OTP to enter - ${response.token}`);
            this.showOtpInput = true;
          },
          (errorMsg: any) => {
            this.checkForErrors(errorMsg);
            console.log(errorMsg);
          }
        );
      }
      else {
        console.log(response);
        this.checkForErrors({'phone':['Enter a valid phone number.']});
      }
    },
      (errorMsg: any) => {
        this.checkForErrors(errorMsg);
      });


  }

  onLogin = (loginResponse: TokenResponse) => {
    this.authService.login(loginResponse.token);
    this.router.navigate(['/role']);
  }

  onLoginError = (errorMsg: any) => {
    console.log(errorMsg);
    this.checkForErrors(errorMsg);
  };

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  onCheckedItemChanged(value: boolean, id: string) {
    // if(value)
    // {
    //     // this.checkboxValues=id;
    //     this.checkboxValues.push(id);
    //}
    if (this.checkboxValues.length == 0) {
      this.checkboxValues.push(id);
    }
    else {
      let index = this.checkboxValues.findIndex(a => a == id);
      if (index != -1) {
        this.checkboxValues.splice(index, 1);
      }
      else {
        this.checkboxValues.push(id);
      }
    }
  }

  getidstage(event) {
    this.capturedInfo = event;
    //this.signupForm.value.IDproof = this.capturedInfo.id_number;
    this.signupForm.value.idproof = this.capturedInfo.id_number;
    this.isStage = this.capturedInfo.isStage;
    this.capturedInfo.id_type = this.signupForm.value.idmethod;
    this.idsignupprocess=false;
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
}
