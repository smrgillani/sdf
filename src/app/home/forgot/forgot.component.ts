  import { Location } from '@angular/common';
  import { Component, OnInit, Input } from '@angular/core';
  import { FormGroup, FormBuilder, Validators, FormsModule, AbstractControlDirective } from '@angular/forms';
  import { Router } from '@angular/router';
  import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
  //import { AuthService } from 'app/auth/auth.service';
  // import { LoginService, ResetPasswordResponse, TokenResponse } from 'app/auth/login.service';
import { ForgotService, ResetPasswordResponse } from 'app/auth/forgot.service';
 // import { SignupService } from 'app/auth/signup.service';
  //import UserProfileModel from 'app/core/models/UserProfileModel';
  import { TermsOfUseContent } from '../terms-of-use/terms-of-use.component';
  import {ForgotErrors} from './form-errors';
  import { ResetPasswordRequest } from 'app/auth/models/ResetPasswordRequest';
  import {SelectItem} from 'primeng/primeng';
import { SignupService } from 'app/auth/signup.service';

  @Component({
    selector: 'app-forgot',
    templateUrl: './forgot.component.html',
    styleUrls: [
      './forgot.component.scss',
      './forgot.component.portrait.css'
    ],
    providers: [ForgotService, SignupService]
  })
  export class ForgotComponent implements OnInit {

    popUpOptions: NgbModalOptions = {backdrop: false, windowClass: 'center-position top50', size: 'lg'};
    private forgotForm: FormGroup;
    messages: any;
    fields = null;
    flagMailSent: boolean = false;
    showOtpInput = false;
    showResetPasswordInput = false;
    uidb64:string;
    token:string;
    invalidOTP:string='';
    question : string;
    question_id:any;
    question_type:string;
    listValue:any; // =[{"key": "m","value":"Male"},{"key":"f","value":"Female"},{"key":"o","value":"Other"}];
    checkboxValues:string[]=[]; //=[{"key": "m","value":"ck_Male"},{"key":"f","value":"ck_Female"},{"key":"o","value":"ck_Other"}];
  flagQuestionEnable:boolean=false;
  flagResetPassword:boolean=false;
  tempAnswer:string[]=[];
  msgArray = [];
  forgotMethod: SelectItem[];
  iDProofOption: SelectItem[];
  showCapturePhoto: boolean = false;
  capturedPhoto: string = '';


    constructor(
      private router: Router,
    // private signupService: SignupService,
      private formBuilder: FormBuilder,
     // private authService: AuthService,
      private forgotService: ForgotService,
      // private _location: Location,
       private modalService: NgbModal
    ) {
      this.forgotForm = formBuilder.group({
        method: ['email', []],
        common: ['', []],
        email: ['', []],
        phone: ['', []],
        user_name: ['', []],
        IDproof: ['', []],
        idproofnumber: ['', []],
        password: ['', []],
        otp: ['', []],
        question: ['', []],
        answer: ['', []],
        new_password1:['',[]],
        new_password2:['',[]],
        // username_password: ['', []],
        // username_c_password: ['', []],
        // phone_pass: ['', []],
        // phone_c_pass: ['', []]
      });
      this.forgotMethod = [
        {label: 'Email', value: 'email'},
        {label: 'Phone', value: 'phone'},
        {label: 'User Name', value: 'username'},
        {label: 'ID Proof', value: 'idproof'},
      ];
      this.iDProofOption =[
        {label: 'Select ID Proof', value: '-1'},
        {label: 'Passport', value: 'passport'},
        {label: 'Driving License', value: 'driving_license'}
      ];
    }

    ngOnInit() {
      this.messages = new ForgotErrors();
      this.forgotForm.valueChanges.subscribe((e) => {
        this.forgotForm.controls['common'].setErrors(null);
      });
    }
resetAllflags()
{
  this.showCapturePhoto = false;
  this.showOtpInput = false;
  this.showResetPasswordInput = false;
  this.flagQuestionEnable=false;
  this.flagResetPassword=false;
  this.flagMailSent = false;
}


    removeErrors(value) {
      this.resetAllflags();
      this.fields = [];
      Object.keys(this.forgotForm.controls).forEach((control) => {
        this.forgotForm.controls[control].setErrors(null);
      });
    }

    resetPassword() {
      this.fields = this.forgotForm.controls;
      const data = this.forgotForm.value;
      const resetPasswordData: ResetPasswordRequest =
        data.method === 'email' && { email: data.email } ||
        data.method === 'phone' && { phone: data.phone } ||
        data.method === 'username' && { user_name: data.user_name }
        data.method === 'idproof' && { id_number: data.idproofnumber };
      if (this.forgotForm.valid) {
        if(data.method === 'email')
        {
        this.forgotService.resetPassword(resetPasswordData)
          .subscribe(
          (response: ResetPasswordResponse) => {
            console.log('response');
            console.log(response);
            this.flagMailSent = true;
          },
          (errMsg: any) => {
            console.log('errMsg');
            console.log(errMsg);
            this.checkForErrors(errMsg);
          }
          );}
     else if(data.method === 'phone')
       {
          const resetData: {new_password:string, confirm_password:string} = 
          {new_password:data.new_password1,confirm_password:data.new_password2};

            this.forgotService.doResetPassword(data.new_password1, data.new_password2,this.uidb64,this.token)
             .subscribe(
                     (response: ResetPasswordResponse) => {
                      console.log('response');
                      console.log(response);
                       //navigate to password-updated page
          this.router.navigateByUrl('/passwordupdated');
                       },
                    (errMsg: any) => {
                       console.log('errMsg');
                       console.log(errMsg);
                        this.checkForErrors(errMsg);
                         }
                       );
           }

           // username_password: 
        //username_c_password:
         else if(data.method === 'username')
           {
              const resetData: {new_password:string, confirm_password:string} = 
              {new_password:data.new_password1,confirm_password:data.new_password2};
    
                this.forgotService.doResetPassword(data.new_password1, data.new_password2,this.uidb64,this.token)
                 .subscribe(
                         (response: ResetPasswordResponse) => {
                          console.log('response');
                          console.log(response);
                           //navigate to password-updated page
          this.router.navigateByUrl('/passwordupdated');
                           },
                        (errMsg: any) => {
                           console.log('errMsg');
                           console.log(errMsg);
                            this.checkForErrors(errMsg);
                             }
                           );
               }

               else if(data.method === 'idproof')
               {
                  const resetData: {new_password:string, confirm_password:string} = 
                  {new_password:data.new_password1,confirm_password:data.new_password2};
        
                    this.forgotService.doResetPassword(data.new_password1, data.new_password2,this.uidb64,this.token)
                     .subscribe(
                             (response: ResetPasswordResponse) => {
                              console.log('response');
                              console.log(response);
                               //navigate to password-updated page
                  this.router.navigateByUrl('/passwordupdated');
                               },
                            (errMsg: any) => {
                               console.log('errMsg');
                               console.log(errMsg);
                                this.checkForErrors(errMsg);
                                 }
                               );
                   }

             }
      }

    checkForErrors(errorMsg) {
    this.msgArray = [];
      let newErr = {};
      Object.keys(errorMsg).forEach((err) => {
      const value = errorMsg[err];
      this.msgArray.push(value[0].message);
        console.log(this.msgArray);
//        newErr[err] = true;
//        this.forgotForm.controls[err] ? this.forgotForm.controls[err].setErrors(newErr)
//          : this.forgotForm.controls['common'].setErrors(newErr);
      });
    }

    // onLogin = (loginResponse: TokenResponse) => {
    //   this.authService.login(loginResponse.token);
    // }

    onLoginError = (errorMsg: any) => {
      console.log(errorMsg);
      this.checkForErrors(errorMsg);
    };

    sendCode() {
      const phone: string = this.forgotForm.value.phone;
      this.fields = {phone: this.forgotForm.controls['phone']};
      if (!this.forgotForm.controls['phone'].value) this.forgotForm.controls['phone'].setErrors({required: true});
      this.forgotService.phoneResetPassword({phone})
        .subscribe(
          (response: any) => {
            console.log(response.token);
          this.showOtpInput = true;
          },
          (errorMsg: any) => {
            this.checkForErrors(errorMsg);
            console.log(errorMsg);
          }
        );
    }

    confirmOTP()
    {
      const phone: string = this.forgotForm.value.phone;
      const otp: string = this.forgotForm.value.otp;
      this.fields = {phone: this.forgotForm.controls['phone'],password: this.forgotForm.controls['otp']};
      if (!this.forgotForm.controls['phone'].value) this.forgotForm.controls['phone'].setErrors({required: true});
      this.forgotService.confirmOTP({phone,otp})
        .subscribe(
          (response: any) => {
            console.log(response);
            // if(response=='OTP is Invalid')
            // {
            //     this.invalidOTP = response;
            // }
            // else{         
            this.token=response.token;
            this.uidb64=response.uidb64;
          this.showResetPasswordInput = true;
          // }
          },
          (errorMsg: any) => {
            this.checkForErrors(errorMsg);
            console.log(errorMsg);
          }
        );
    }

    getQuestion()
    {
      const user_name:string=this.forgotForm.value.user_name;
      this.fields={user_name:this.forgotForm.controls['user_name']};
      if(!this.forgotForm.controls['user_name'].value)
        this.forgotForm.controls['user_name'].setErrors({required:true});
      
      this.forgotService.getQuestion({user_name}).subscribe(
        (Que: any) => {        
          console.log('Question');
          console.log(Que);
          this.question=Que.security_question[1];      //Que[0].title;
          this.question_id=Que.security_question[0];
          this.question_type=Que.security_question[2];             //Que[0].question_type;
          this.listValue= Que.vals;          //Que[0].vals;
          console.log(this.listValue);
        // this.question_type='checkbox'
          console.log(this.question_id); 
  this.flagQuestionEnable=true;
        },
        (errorMsg: any) => {
          this.checkForErrors(errorMsg);
          console.log(errorMsg);
        }
      );
    }
      
    checkSecurityQuestion()
     {       
       // this.fields = this.forgotForm.controls;
       this.fields = {user_name:this.forgotForm.controls['user_name'], answer:this.forgotForm.controls['answer']};
      //if (this.forgotForm.valid) {
        const method: string = this.forgotForm.value.method;
         const user_name: string =this.forgotForm.value.user_name;
        //Returning Question Id as security_question requested by Backend developer
        const security_question: number =this.question_id;
      if(this.question_type==='checkboxes')
        {
            this.tempAnswer=this.checkboxValues;
          }
      else
      {        //this is for question_type other than checkboxes
        this.tempAnswer  = this.forgotForm.value.answer;
      }
      const answer=this.tempAnswer;
      if (!this.forgotForm.controls['answer'].value) this.forgotForm.controls['answer'].setErrors({required: true});
      this.forgotService.confirmSecurityQuestion({user_name,security_question,answer})
      .subscribe(
        (response: any) => {       
      
          console.log(response); 
          this.token=response.token;
          this.uidb64=response.uidb64;
          this.flagResetPassword=true;
        },
        (errorMsg: any) => {
          this.checkForErrors(errorMsg);
          console.log(errorMsg);
        }
      );
       // }
      }

      
  onCheckedItemChanged(value:boolean,id:string){
    // if(value)
    // {
    //     // this.checkboxValues=id;
    //     this.checkboxValues.push(id);
    //}
     if(this.checkboxValues.length==0)
    {
      this.checkboxValues.push(id);
      }
    else{
      let index=this.checkboxValues.findIndex(a=>a == id);
      if(index !=-1)
      {
        this.checkboxValues.splice(index,1);
      }
      else
      {
        this.checkboxValues.push(id);
      }
    }
  }

  
  openPrivacyPolicyModal() {
    const modalRef = this.modalService.open(TermsOfUseContent, this.popUpOptions);
    modalRef.componentInstance.title = 'Privacy Policy';
  }

  openTermsOfUseModal() {
    const modalRef = this.modalService.open(TermsOfUseContent, this.popUpOptions);
    modalRef.componentInstance.title = 'Terms of Use';
  }

  getidstage(event) {
    console.log(event);
    this.token = event.token;
    this.uidb64 = event.uidb64;
    this.capturedPhoto = event.capturedImage;
    this.showCapturePhoto = false;
    this.showResetPasswordInput = true;
  }

  }
