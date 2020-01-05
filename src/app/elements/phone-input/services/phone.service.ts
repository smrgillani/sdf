import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Http, RequestOptionsArgs, Response, Headers } from '@angular/http';

import { ApiService } from 'app/core/api/api.service';
import { environment } from 'environments/environment';

@Injectable()
export class PhoneService {

  constructor(private api: ApiService, private http: Http) { }
  
  extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  protected handleError(error: any) {
    const errorJson = error.json();
    const errorMsg = errorJson || error;
    return Observable.throw(errorMsg);
  }

  getCountryFlagByPhone(isd_code: number): Observable<any> {
    let body = { isd_code: isd_code };
    //return this.api.post(`country-flag`, body);

    const headers = new Headers();
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    headers.append('Content-Type', 'application/json');
    options.headers = headers;

    return this.http.post(`${environment.server}/country-flag/`, body, options)
    .map((r: Response) => {  return r.json()  })
    .catch(err => this.handleError(err));

  }

  getCountryCodeByIp() {
    return this.http.get('https://ipstack.com/')
    .map((r: Response) => {  return r.json()  })
    .catch(err => this.handleError(err));
  }
}
