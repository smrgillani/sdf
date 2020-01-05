import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormsModule, AbstractControlDirective} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ForgotService, ResetPasswordResponse } from 'app/auth/forgot.service';
import {ResetErrors} from './form-errors';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: [
    '../login/login.component.scss',
    '../login/login.component.portrait.css',
    './reset-password.component.css'
  ],
  providers: [ForgotService]
})
export class ResetPasswordComponent implements OnInit {
  private resetForm: FormGroup;
  private sub: any;
  messages: any;
  fields = null;
  uidb64:string;
  token:string;
  msgArray = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private forgotService: ForgotService,
  ) { 
    this.resetForm = formBuilder.group({
      // newPassword: ['', []],
      // confirmPassword: ['', []]     
      common: ['', []], 
      password:['',[]],
      confirmPassword:['',[]]
    });
  }

  ngOnInit() {
    this.messages = new ResetErrors();
    this.resetForm.valueChanges.subscribe((e) => {
      this.resetForm.controls['common'].setErrors(null);
    });
    this.sub = this.route.params.subscribe(params => {
      this.uidb64 = params['uidb64'];
      this.token = params['token'];
   });
  }
  resetPassword(){
    this.fields = this.resetForm.controls;
    const data = this.resetForm.value;

    const resetData: {newPassword:string, confirmPassword:string} = 
      {newPassword:data.password,confirmPassword:data.confirmPassword};
    
    if (this.resetForm.valid) {
      this.forgotService.doResetPassword(data.password, data.confirmPassword,this.uidb64,this.token)
        .subscribe(
        (response: ResetPasswordResponse) => {
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

  checkForErrors(errorMsg) {
    this.msgArray = [];
    let newErr = {};
    Object.keys(errorMsg).forEach((err) => {
      const value = errorMsg[err];
      this.msgArray.push(value[0].message);
      /*const errorCode = value[0].code;
      console.log(errorCode);
      newErr[errorCode] = true;
      this.resetForm.controls[err] ? this.resetForm.controls[err].setErrors(newErr)
        : this.resetForm.controls['common'].setErrors(newErr);*/

    });
  }
}
