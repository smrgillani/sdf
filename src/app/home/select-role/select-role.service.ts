import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptionsArgs} from '@angular/http';
import {Observable, Subscriber} from 'rxjs/Rx';


import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {environment} from '../../../environments/environment';
import {CommonResponse} from '../../core/api/CommonResponse';
import {AuthHttp} from 'angular2-jwt';


@Injectable()
export class SelectRoleService {
  constructor(private http: Http,
              private authHttp: AuthHttp
  ) {

  }

  select(role: string): Observable<CommonResponse> {
    const body = JSON.stringify({});
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    options.headers = headers;

    return this.authHttp.post(environment.server + '/' + role + '/join' , body, options)
      .map((r: Response) => r.json() as CommonResponse)
      .catch(this.handleObservableError);
  }

  handleObservableError(error: any) {
    return Observable.throw(error.json().error || 'Join error');
  }
}
