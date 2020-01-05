import { Injectable } from '@angular/core';
import { ApiService } from 'app/core/api/api.service';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';
import { Headers } from '@angular/http';

import { MetricesModel } from 'app/projects/models/metrices-model';

@Injectable()
export class MetricesService {

  constructor(private api: ApiService) { }

  /**
    * Get current employee profile and it's process details on emp id.
    *
    * @returns current employee profile and it's process details
    */
  getCurrentEmployeeProfileProcess(empProfileId: number, projectId: string): Observable<any> {
    let myHeader = new Headers();
    myHeader.append('project', projectId);

    return this.api.get<any>(`recruitments/current-employee/${empProfileId}/processes`, {}, myHeader);
  }


  getProjectMouseFlowList( projectId: any, taskId: any): Observable<any> {
    let apiURl = `project/recordings/?project-id=` + projectId ;
    if (taskId) {
      apiURl += '&task-id=' + taskId;
    }

    return this.api.get<any>(apiURl);
  }

  getMouseFlowVideoShareId( recordId: any): Observable<any> {


    return this.api.get<any>(`project/recordings/share/?recording-id=` + recordId);
  }


  getMouseFlowSessionStart( archiveId: any, taskId: any): Observable<any> {
    return this.api.get<any>(`project/recordings/start?task-id=` + taskId + `&archive_id=` + archiveId);
  }


  /**
    * Get current employee process list details on emp id.
    *
    * @returns current employee process list details
    */
  getCurrentEmployeeProcessList(empProfileId: number, projectId: string, process_id: number, startPage?, pageSize?, search?): Observable<any> {
    let myHeader = new Headers();
    myHeader.append('project', projectId);
    if (!startPage) {
      startPage = 0;
    }
    if (!pageSize) {
      pageSize = 10;
    }
    const offset = (startPage - 1) * pageSize;
    return this.api.get<any>(`recruitments/current-employee/${empProfileId}/processes/${process_id}/metrices`, { offset: offset, limit: pageSize, search: search }, myHeader);
  }

  getWebRTCArchive(id) {
    return this.api.get<any>(`webrtc/webrtc-get-archive`, {id: id});
  }

  /**
    * Get current loged in employee process list details on project id.
    *
    * @returns current employee process list details
    */
   getEmployeeProcessList(process_id: number, type: string, startPage?, pageSize?, search?): Observable<any> {
    if (!pageSize) {
      pageSize = 10;
    }
    const offset = (startPage - 1) * pageSize;
    //ongoing-projects or past-projects
    return this.api.get<any>(`employee/${type}/${process_id}/metrices`, { offset: offset, limit: pageSize, search: search });
  }

}
