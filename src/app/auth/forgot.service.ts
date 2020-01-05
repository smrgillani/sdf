import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptionsArgs } from '@angular/http';
// import { AuthHttp } from 'angular2-jwt';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { LoginRequest } from './models/LoginRequest';
import { environment } from 'environments/environment';
import { CommonResponse } from 'app/core/api/CommonResponse';
import { Header } from 'primeng/primeng';
import { ResetPasswordRequest } from 'app/auth/models/ResetPasswordRequest';


export class ResetPasswordResponse {
  resetPasswordMessage: string;
}

/**
 * Forgot service.
 * Use for calling Forgot password related API.
 */
@Injectable()
export class ForgotService {
  constructor(private http: Http
    //private authHttp: AuthHttp
  ) {

  }

 
  handleObservableError(error: any) {
    return Observable.throw(error.json().error || error.json());
  }

  /**
 * Obtain ResetPasswordResponse using credentials (resetPasswordData)
 *
 * @param resetPasswordData - must be phone or email or username
 * @returns {Observable<R|T>}
 */
  resetPassword(resetPasswordData: ResetPasswordRequest): Observable<ResetPasswordResponse> {
    const body = JSON.stringify(resetPasswordData);
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    options.headers = headers;

    return this.http.post(environment.server + '/password_reset/', body, options)
      .map((r: Response) => r.json() as ResetPasswordResponse)
      .catch(this.handleObservableError);
  }

  doResetPassword(new_password:string, confirm_password:string, uidb64:string, token:string):Observable<ResetPasswordResponse>{
    const body = JSON.stringify({new_password:new_password,confirm_password:confirm_password});
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    options.headers = headers;

    return this.http.post(environment.server + '/reset/' + uidb64 + '/' + token + '/', body, options)
      .map((r: Response) => r.json() as ResetPasswordResponse)
      .catch(this.handleObservableError);
  }

 /**
 * Obtain ResetPasswordResponse using credentials (resetPasswordData)
 *
 * @param resetPasswordData - must be phone to generate OTP
 * @returns {Observable<R|T>}
 */
phoneResetPassword(resetPasswordData: ResetPasswordRequest): Observable<ResetPasswordResponse> {
  const body = JSON.stringify(resetPasswordData);
  const options: RequestOptionsArgs = <RequestOptionsArgs>{};
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  options.headers = headers;

  return this.http.post(environment.server + '/phone_password_reset/', body, options)
    .map((r: Response) => r.json() as ResetPasswordResponse)
    .catch(this.handleObservableError);
}

 /**
 * Obtain ResetPasswordResponse using credentials (resetPasswordData)
 *
 * @param resetPasswordData - must be (OTP)phone to confirm OTP
 * @returns {Observable<R|T>}
 */
confirmOTP(resetPasswordData: ResetPasswordRequest): Observable<ResetPasswordRequest> {
  const body = JSON.stringify(resetPasswordData);
  const options: RequestOptionsArgs = <RequestOptionsArgs>{};
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  options.headers = headers;

  return this.http.post(environment.server + '/phone_password_reset/otp/', body, options)
    .map((r: Response) => r.json() as ResetPasswordRequest)
    .catch(this.handleObservableError);
}

 /**
 * Obtain ResetPasswordResponse using credentials (resetPasswordData)
 *
 * @param resetPasswordData - must be username to get seurity Question
 * @returns {Observable<R|T>}
 */
getQuestion(resetPasswordData:ResetPasswordRequest):Observable<CommonResponse>{
  const body = JSON.stringify(resetPasswordData);
  const options: RequestOptionsArgs = <RequestOptionsArgs>{};
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  options.headers = headers;

  return this.http.post(environment.server + '/username_password_reset/', body, options)
    .map((r: Response) => r.json() as CommonResponse)
    .catch(this.handleObservableError);
}

/**
 * Obtain ResetPasswordRequest using credentials (resetPasswordData)
 *
 * @param resetPasswordData - must be (OTP)phone to confirm OTP
 * @returns {Observable<R|T>}
 */
confirmSecurityQuestion(resetPasswordData: ResetPasswordRequest): Observable<ResetPasswordRequest> {
  const body = JSON.stringify(resetPasswordData);
  const options: RequestOptionsArgs = <RequestOptionsArgs>{};
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  options.headers = headers;

  return this.http.post(environment.server + '/username_password_reset/security_question/', body, options)
    .map((r: Response) => r.json() as ResetPasswordRequest)
    .catch(this.handleObservableError);
}
}
