import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptionsArgs } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { environment } from 'environments/environment';
import { LoaderService } from 'app/loader.service';


/**
 * Service for communicating with REST API
 */
@Injectable()
export class ApiService {
  loaderRequests = 0;

  constructor(private authHttp: AuthHttp, private http: Http, private loaderService: LoaderService) {
  }

  /**
   * Get server resource.
   *
   * @param path - resource path
   * @param params - query params (path?param1=value1&param2=value2)
   * @returns observable of T
   */
  get<T>(path: string, params = {}, headers?: Headers): Observable<T> {
    if (
      path.indexOf('answers') < 0 &&
      path.indexOf('employer-search') < 0 &&
      path.indexOf('autocomplite') < 0 &&
      path.indexOf('chat/user/profile') < 0 &&
      path.indexOf('webrtc-active-sessions') < 0 &&
      path.indexOf('trade-details') < 0

      // path.indexOf('lunch-room') < 0 &&
      // path.indexOf('project-user-list') < 0
      // && (path.indexOf('projects/')<0 && path.indexOf('/funds')<0 && path.indexOf('/funds/')>0)
    ) {
      this.loaderRequests++;

      if (this.loaderRequests <= 1) {
        this.loaderService.loaderStatus.next(true);
      }
    }

    const options = <RequestOptionsArgs>{
      params: params,
    };

    if (headers) {
      options.headers = headers;
    }

    return this.authHttp.get(`${environment.server}/${path}/`, options)
      .map((response: Response): T => {
        if (
          path.indexOf('answers') < 0 &&
          path.indexOf('employer-search') < 0 &&
          path.indexOf('autocomplite') < 0 &&
          path.indexOf('chat/user/profile') < 0 &&
          path.indexOf('webrtc-active-sessions') < 0 &&
          path.indexOf('trade-details') < 0
         // path.indexOf('lunch-room') < 0 &&
         // path.indexOf('project-user-list') < 0
         // && (path.indexOf('projects/')<0 && path.indexOf('/funds')<0 && path.indexOf('/funds/')>0)
        ) {
          this.loaderRequests--;
        }

        if (this.loaderRequests <= 0) {
          this.loaderService.loaderStatus.next(false);
        }

        return response.json();
      })
      .catch(err => this.handleError(err, this.loaderService));
  }

  /**
   * Create server resource.
   *
   * @param path
   * @param data
   * @returns observable of T
   */
  post<InT, OutT>(path: string, data: InT): Observable<OutT> {
    if (path.indexOf('answers') < 0) {
      this.loaderRequests++;

      if (this.loaderRequests <= 1) {
        this.loaderService.loaderStatus.next(true);
      }
    }

    return this.authHttp.post(`${environment.server}/${path}/`, data)
      .map((r: Response) => {
        if (path.indexOf('answers') < 0) {
          this.loaderRequests--;
        }

        if (this.loaderRequests <= 0) {
          this.loaderService.loaderStatus.next(false);
        }
        return r.json() as OutT;
      })
      .catch(err => this.handleError(err, this.loaderService));
  }

  /**
   * Partially update server resource.
   * @param path
   * @param data
   * @returns observable of T
   */
  patch<InT, OutT>(path: string, data: InT): Observable<OutT> {
    if (path.indexOf('answers') < 0 && path.indexOf('task/documents') < 0) {
      this.loaderRequests++;

      if (this.loaderRequests <= 1) {
        this.loaderService.loaderStatus.next(true);
      }
    }

    return this.authHttp.patch(`${environment.server}/${path}/`, data)
      .map((r: Response) => {
        if (path.indexOf('answers') < 0 && path.indexOf('task/documents') < 0) {
          this.loaderRequests--;
        }

        if (this.loaderRequests <= 0) {
          this.loaderService.loaderStatus.next(false);
        }

        return r.json() as OutT;
      })
      .catch(err => this.handleError(err, this.loaderService));
  }

  /**
   * Update server resource.
   * @param path
   * @param data
   * @returns observable of T
   */
  put<InT, OutT>(path: string, data: InT): Observable<OutT> {
    if (path.indexOf('answers') < 0) {
      this.loaderRequests++;

      if (this.loaderRequests <= 1) {
        this.loaderService.loaderStatus.next(true);
      }
    }
    return this.authHttp.put(`${environment.server}/${path}/`, data)
      .map((r: Response) => {
        if (path.indexOf('answers') < 0) {
          this.loaderRequests--;
        }

        if (this.loaderRequests <= 0) {
          this.loaderService.loaderStatus.next(false);
        }

        return r.json() as OutT;
      })
      .catch(err => this.handleError(err, this.loaderService));
  }

  /**
   * Delete server resource.
   *
   * @param path
   * @returns observable of T
   */
  delete(path) {
    if (path.indexOf('answers') < 0) {
      this.loaderRequests++;

      if (this.loaderRequests <= 1) {
        this.loaderService.loaderStatus.next(true);
      }
    }

    return this.authHttp.delete(`${environment.server}/${path}/`)
      .map((r: Response) => {
        if (path.indexOf('answers') < 0) {
          this.loaderRequests--;
        }

        if (this.loaderRequests <= 0) {
          this.loaderService.loaderStatus.next(false);
        }
        return r.json();
      })
      .catch(err => this.handleError(err, this.loaderService));
  }

  /**
   * Create server resource.
   *
   * @param path
   * @param data
   * @returns observable of T
   */
  postForFile<InT>(path: string, data: InT): Observable<any> {
    if (path.indexOf('answers') < 0) {
      this.loaderRequests++;

      if (this.loaderRequests <= 1) {
        this.loaderService.loaderStatus.next(true);
      }
    }

    return this.authHttp.post(`${environment.server}/${path}/`, data)
      .map((r: Response) => {
        if (path.indexOf('answers') < 0) {
          this.loaderRequests--;
        }

        if (this.loaderRequests <= 0) {
          this.loaderService.loaderStatus.next(false);
        }
        return r;
      })
      .catch(err => this.handleError(err, this.loaderService));
  }

  /**
   * Get server resource as blob(any).
   *
   * @param path - resource path
   * @param params - query params (path?param1=value1&param2=value2)
   * @returns observable of any
   */
  getForFile<T>(path: string, params = {}, headers?: Headers): Observable<any> {
    this.loaderRequests++;

    if (this.loaderRequests <= 1) {
      this.loaderService.loaderStatus.next(true);
    }

    const options = <RequestOptionsArgs>{
      params: params,
    };

    if (headers) {
      options.headers = headers;
    }

    return this.authHttp.get(`${environment.server}/${path}/`, options)
      .map((response: Response): any => {
        this.loaderRequests--;

        if (this.loaderRequests <= 0) {
          this.loaderService.loaderStatus.next(false);
        }

        return response;
      })
      .catch(err => this.handleError(err, this.loaderService));
  }

  getFileAsBlob(path: string) {
    this.loaderRequests++;

    if (this.loaderRequests <= 1) {
      this.loaderService.loaderStatus.next(true);
    }

    const options = new RequestOptions({responseType: ResponseContentType.Blob});

    return this.authHttp.get(`${environment.server}/${path}`, options)
      .map((response) => {
        this.loaderRequests--;

        if (this.loaderRequests <= 0) {
          this.loaderService.loaderStatus.next(false);
        }

        return response.blob();
      })
      .catch(err => this.handleError(err, this.loaderService));
  }

  protected handleError(error: any, loaderService: LoaderService) {
    loaderService.loaderStatus.next(false);

    const errorJson = error.json();
    const errorMsg = errorJson || error;

    return Observable.throw(errorMsg);
  }
}
