import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class TermsOfUseService {
  constructor(private http: Http) {}

  getPrivacyPolicy(): Observable<any> {
    return this.http.get(environment.server + '/misc/pages/')
      .map((r: Response) => r.json());
  }
}
