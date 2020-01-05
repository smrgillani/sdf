import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptionsArgs} from '@angular/http';
import {Observable} from 'rxjs/Rx';


import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import UserProfileModel from 'app/core/models/UserProfileModel';
import {EmailSignupRequest} from './models/EmailSignupRequest';
import {environment} from 'environments/environment';
import {PhoneSignupRequest} from './models/PhoneSignupRequest';
import {UsernameSignupRequest} from './models/UsernameSignupRequest';
import { CommonResponse } from 'app/core/api/CommonResponse';

@Injectable()
export class SignupService {
  constructor(private http: Http
  ) {

  }

  /**
   * Sign up using email and password.
   *
   * @param signupData
   * @returns {Observable<R|T>}
   */
  signupWithEmail(signupData: EmailSignupRequest): Observable<UserProfileModel> {
    const body = JSON.stringify(signupData);
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    options.headers = headers;

    return this.http.post(environment.server + '/register/', body, options)
      .map((r: Response) => r.json() as UserProfileModel)
      .catch(this.handleObservableError);
  }

  /**
   * Sign up using phone only.
   *
   * @param signupData
   * @returns {Observable<R|T>}
   */
  signupWithPhone(signupData: PhoneSignupRequest): Observable<UserProfileModel> {
    const body = JSON.stringify(signupData);
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    options.headers = headers;

    return this.http.post(environment.server + '/otp/login/', body, options)
      .map((r: Response) => r.json() as UserProfileModel)
      .catch(this.handleObservableError);
  }

  checkPhoneIsValid(phone: string): Observable<any>{
    return this.http.get(environment.server+`/phone_verify/?phone_number=${phone}`)
    .map((r:Response) =>r.json())
    .catch(this.handleObservableError);
  }

  handleObservableError(error: any) {
    return Observable.throw(error.json().error || error.json());
  }

  /**
   * Sign up using Username, Question-Answer and password.
   *
   * @param signupData
   * @returns {Observable<R|T>}
   */
  signupWithUsername(signupData: UsernameSignupRequest): Observable<UserProfileModel> {
    const body = JSON.stringify(signupData);
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    options.headers = headers;

    return this.http.post(environment.server + '/usernameregister/', body, options)
      .map((r: Response) => r.json() as UserProfileModel)
      .catch(this.handleObservableError);
  }

  /*
  *get Question and Question type for Signup with User name
  */
  getQuestion():Observable<CommonResponse>{
  const options:RequestOptionsArgs =<RequestOptionsArgs>{};

    return this.http.get(environment.server+'/security-questions',options)
      .map((r:Response) =>r.json() as CommonResponse)
      .catch(this.handleObservableError);
  }

  /**
   * Sign up using Username, Question-Answer and password.
   *
   * @param signupData
   * @returns {Observable<R|T>}
   */
  signupWithIdProof(signupData): Observable<UserProfileModel> {
    const body = signupData;//JSON.stringify(signupData);
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    options.headers = headers;

    return this.http.post(environment.server + '/idproofregister/', body, options)
      .map((r: Response) => r.json() as UserProfileModel)
      .catch(this.handleObservableError);
  }

  checkIdVerification(signUpInfo): Observable<any>{
    const data = Object.assign({}, signUpInfo);
    signUpInfo.frontImage ? data.frontImage = signUpInfo.frontImage.split(',')[1] : '';
    signUpInfo.backImage ? data.backImage = signUpInfo.backImage.split(',')[1] : '';
    //const body = JSON.stringify(signUpInfo);
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    options.headers = headers;

    return this.http.post(environment.server + '/idcheck-verify/', data, options)
      .map((r: Response) => r.json())
      .catch(this.handleObservableError);
  }

  verifyFaceWithDocumentInfo(data): Observable<any> {
    const body = data;//JSON.stringify(data);
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    options.headers = headers;

    return this.http.post(environment.server + '/face-verify/', body, options)
      .map((r: Response) => r.json())
      .catch(this.handleObservableError);
  }
}
