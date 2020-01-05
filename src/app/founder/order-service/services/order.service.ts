import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';
import FormData from 'formdata-polyfill/formdata.min';
import { AuthHttp } from 'angular2-jwt';
import { Response, RequestOptionsArgs, Headers, RequestOptions, ResponseContentType } from '@angular/http';

import { ApiService } from 'app/core/api/api.service';
import { HasId } from 'app/core/interfaces';
import { NewServiceModel } from 'app/founder/order-service/models/new-service-model';
import DocumentModel from 'app/core/models/DocumentModel';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/loader.service';

export class Visibility implements HasId {
  id: number;
  is_visible: boolean;
}

@Injectable()
export class OrderService {

  constructor(private api: ApiService, private authHttp: AuthHttp, private loaderService: LoaderService) { }

  postNewService(newOrderInfo: any): Observable<any> {
    return this.api.post('essay/request-service', newOrderInfo);
  }

  putNewService<T extends HasId>(orderInfo: T): Observable<any> {
    return this.api.put(`essay/request-service/${orderInfo.id}`, orderInfo);
  }

  postExtensionService(orderInfo: any): Observable<any> {
    return this.api.post(`essay/request-service-extension`, orderInfo);
  }

  getExtensionServiceInfo(id): Observable<any> {
    return this.api.get<any>(`essay/request-service-extension/${id}`);
  }

  putExtensionService<T extends HasId>(orderInfo: T): Observable<any> {
    return this.api.put(`essay/request-service-extension/${orderInfo.id}`, orderInfo);
  }

  postNewWorkAttachmentsService(workAttachments: any): Observable<any> {
    return this.api.post(`essay/work/documents`, workAttachments._blob());
  }

  getOrderServiceList(startPage?, pageSize?, search?, orderType?, projectId?): Observable<any> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      if (orderType) {
        return this.api.get<any>(`essay/request-service/${projectId}/services-list/${orderType}`, { offset: offset, limit: pageSize, search: search });
      }
      else {
        return this.api.get<any>(`essay/request-service/${projectId}/services-list`, { offset: offset, limit: pageSize, search: search });
      }
    }
    return this.api.get<any>(`essay/request-service/${projectId}/services-list/${orderType}`);
  }

  getOrderServiceListForEmp(startPage?, pageSize?, search?): Observable<any> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any>(`essay/request-service`, { offset: offset, limit: pageSize, search: search });
    }
    return this.api.get<any>(`essay/request-service`);
  }

  getOrderServiceInfo(id): Observable<any> {
    return this.api.get<any>(`essay/request-service/${id}`);
  }

  getSubjectListInfo(): Observable<any> {
    return this.api.get<any>(`essay/subject-list`);
  }

  getUrgencytList(): Observable<any> {
    return this.api.get<any>(`essay/urgency-list`);
  }

  getExtencivenessList(subjectId: number): Observable<any> {
    return this.api.get<any>(`essay/subject-list/${subjectId}/extensiveness-list`);
  }

  getWordLimitList(): Observable<any> {
    return this.api.get<any>(`essay/wordlimit-list`);
  }

  getComplexityList(): Observable<any> {
    return this.api.get<any>(`essay/complexity-list`);
  }

  getRateSlabList(): Observable<any> {
    return this.api.get<any>(`essay/rates-lab`);
  }

  getPayable(subject: number, urgency: number, expertise: string, extensiveness: number): Observable<any> {
    return this.api.get<any>(`essay/get-payable`, { subject: subject, urgency: urgency, expertise: expertise, extensiveness: extensiveness })
      .map((response) => response);
  }

  /**
   * Get document object.
   * @param documentId
   * @returns observable of object with document name, extension and download path
   */
  get(documentId: number) {
    return this.api.get<DocumentModel>(`essay/work/documents/${documentId}`);
  }

  /**
   * Upload document
   * @param document - document body
   * @param documentId
   * @returns observable
   */
  saveDocument(document: FormData, documentId: number) {
    return this.api.patch(`essay/work/documents/${documentId}`, document._blob());
  }

  createDocument(data: FormData) {
    return this.api.post('essay/work/documents', data._blob());
  }

  /**
   * Change document name
   * @param name - new name
   * @param documentId
   * @returns observable
   */
  rename(name: string, documentId: number) {
    return this.api.patch(`essay/work/documents/${documentId}`, { document_name: name });
  }

  /**
   * Change document name
   * @param name - new name
   * @param documentId
   * @returns observable
   */
  percentageChange(percentage: number, documentId: number) {
    return this.api.patch(`essay/work/documents/${documentId}`, {percentage: percentage});
  }

  /**
   * Delete document
   * @param documentId
   * @returns observable
   */
  delete(documentId: number) {
    return this.api.delete(`essay/work/documents/${documentId}`);
  }

  downloadSampleOnId(id: number): Observable<any> {
    const options = new RequestOptions({ responseType: ResponseContentType.Blob });

    return this.authHttp.get(`${environment.server}/essay/request-service/${id}/sample-attachments-download/`, options)
      .map((response) => response.blob());
  }

  downloadWorkOnId(id: number): Observable<any> {
    const options = new RequestOptions({ responseType: ResponseContentType.Blob });

    return this.authHttp.get(`${environment.server}/essay/request-service/${id}/work-download/`, options)
      .map((response) => response.blob());
  }

  getExtencivenessInfo(id): Observable<any> {
    return this.api.get<any>(`essay/extensiveness-list/${id}`);
  }

}
