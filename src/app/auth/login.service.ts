import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptionsArgs } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { LoginRequest } from './models/LoginRequest';
import { environment } from 'environments/environment';
import { CommonResponse } from 'app/core/api/CommonResponse';
import { Header } from 'primeng/primeng';
import { ResetPasswordRequest } from 'app/auth/models/ResetPasswordRequest';

//import { SocialUser } from '../home/login/angular4-social-login';
import { SocialUser } from '../home/login/ng4-social-login';

export class TokenResponse {
  token: string;
  otpObject:{otpRequired:boolean,identifier:string};
}

export class ResetPasswordResponse {
  resetPasswordMessage: string;
}

/**
 * Login service.
 * Use for calling authentication API.
 */
@Injectable()
export class LoginService {
  constructor(private http: Http,
    private authHttp: AuthHttp
  ) {

  }

  /**
   * Obtain token using credentials (loginData)
   *
   * @param loginData - must be pair phone+password or email+password or username+password
   * @returns {Observable<R|T>}
   */
  login(loginData: LoginRequest): Observable<TokenResponse> {
    const body = JSON.stringify(loginData);
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    options.headers = headers;

    // return this.http.post(environment.server + '/api-token-auth/', body, options)
    //   .map((r: Response) => r.json() as TokenResponse)
    //   .catch(this.handleObservableError);
    return this.http.post(environment.server + '/api-token-auth/', body, options)
      .map((r: Response) => r.json() as TokenResponse)
      .catch(this.handleObservableError);
  }

  otpLogin(data: { email: string, phone:string, user_name:string, otp: number }){
    const body = JSON.stringify(data);
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    options.headers = headers;

    return this.http.post(environment.server + '/otp-token-auth/', body, options)
      .map((r: Response) => r.json() as TokenResponse)
      .catch(this.handleObservableError);
  }

  resendOTP(data: { email: string, phone:string, user_name:string,id_number:string, dl_number:string }){
    const body = JSON.stringify(data);
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    options.headers = headers;

    return this.http.post(environment.server + '/resend-otp/', body, options)
      .map((r: Response) => r.json() as TokenResponse)
      .catch(this.handleObservableError);
  }

  /**
   * Obtain temporary authentication token
   * @returns {Observable<R|T>}
   */
  temporaryLogin(): Observable<TokenResponse> {
    const body = JSON.stringify({});
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    options.headers = headers;

    return this.http.post(environment.server + '/lazy-user-token/', body, options)
      .map((r: Response) => r.json() as TokenResponse)
      .catch(this.handleObservableError);
  }

  /**
   * Authenticate using Facebook oauth token
   *
   * @param token
   * @returns {Observable<R|T>}
   */
  /*socialLogin(token: string): Observable<TokenResponse> {
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/json');
    options.headers.append('Authorization', `Bearer facebook ${token}`);

    return this.http.post(environment.server + '/social-token-auth/', '', options)
      .map((r: Response) => r.json() as TokenResponse)
      .catch(this.handleObservableError);
  }*/
  socialLogin(user: LoginRequest): Observable<TokenResponse> {
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    const body = JSON.stringify(user);
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/json');

    return this.http.post(environment.server + '/social-token-auth/', body, options)
      .map((r: Response) => r.json() as TokenResponse)
      .catch(this.handleObservableError);
  }

  socialmediaLogin(user: SocialUser): Observable<LoginRequest>{
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    const body = JSON.stringify(user);
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/json');

    return this.http.post(environment.server + '/socialmedia-user/', body, options)
      .map((r: Response) => r.json() as LoginRequest)
      .catch(this.handleObservableError);
  }

  getLoginStatus(): Observable<CommonResponse> {
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};

    return this.authHttp.get(environment.server + '/status', options)
      .map((r: Response) => r.json() as CommonResponse)
      .catch(this.handleObservableError);
  }

  checkPhoneIsValid(phone: string): Observable<any>{
    return this.http.get(environment.server+`/phone_verify/?phone_number=${phone}`)
    .map((r:Response) =>r.json())
    .catch(this.handleObservableError);
  }

  getTwitterData(oauth_token:string, oauth_verifier:string): Observable<LoginRequest>{
    const body = JSON.stringify({oauth_token:oauth_token,oauth_verifier:oauth_verifier});  
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    options.headers = headers;

    return this.http.post(environment.server + '/twitter/login/callback/',body, options)
    .map((r: Response) => 
      r.json() as LoginRequest
    )
    .catch(this.handleObservableError);
}

handleObservableError(error: any) {
    return Observable.throw(error.json().error || error.json());
  }


}
