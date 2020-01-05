import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as _ from 'lodash';

import { Headers, Http, Response, RequestOptionsArgs } from '@angular/http';
import { environment } from 'environments/environment';
import {ApiService} from 'app/core/api/api.service';
import { AuthHttp } from 'angular2-jwt';

import {RecruitmentFilterModel} from 'app/projects/models/RecruitmentFilterModel';
import { CommonResponse } from 'app/core/api/CommonResponse';
import {PublishJobModel} from 'app/projects/models/PublishJobModel';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs';
import {HireEmployeeModel} from './models/HireEmployeeModel';
import {ScheduleInterviewModel,HireEmployeeData,FireEmployeeData} from 'app/projects/models/ScheduleInterviewModel';
import ProjectModel from './models/ProjectModel';

/**
 *  Recruitment Service
 * Service provides functions for operations with Recruitment process
 */

@Injectable()
export class RecruitmentService {  

   
  constructor(private api: ApiService,
       private http: Http,
       private authHttp: AuthHttp) {
  }

  postJobClear: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  publishJobModelData: BehaviorSubject<PublishJobModel> = new BehaviorSubject<PublishJobModel>(null);
  flagGetJobDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  hireEmployeeFilters:BehaviorSubject<PublishJobModel>=new BehaviorSubject<PublishJobModel>(null);
  scheduleOn:BehaviorSubject<any>=new BehaviorSubject<any>(null);

  /**
   * Get Department Filter data
   *
   * @returns Department Filter data
   */
  getDepartmentFilters(): Observable<RecruitmentFilterModel> {
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};

    return this.authHttp.get(environment.server + '/filters/department/', options)
      .map((r: Response) => r.json() as RecruitmentFilterModel)
      .catch(this.handleObservableError);
  }
  
  handleObservableError(error: any) {
    return Observable.throw(error.json().error || error.json());
  }
  
  /**
   * Get availability Filter data
   *
   * @returns availability Filter data
   */
  getAvailabilityFilters(): Observable<RecruitmentFilterModel> {
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};

    return this.authHttp.get(environment.server + '/filters/availability/', options)
      .map((r: Response) => r.json() as RecruitmentFilterModel)
      .catch(this.handleObservableError);
  }
   /**
   * Get availability Filter data
   *
   * @returns availability Filter data
   */
  getExperienceFilters(): Observable<RecruitmentFilterModel> {
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};

    return this.authHttp.get(environment.server + '/filters/experience/', options)
      .map((r: Response) => r.json() as RecruitmentFilterModel)
      .catch(this.handleObservableError);
  }
   /**
   * Get availability Filter data
   *
   * @returns availability Filter data
   */
  getHourlyBudgetFilters(): Observable<RecruitmentFilterModel> {
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};

    return this.authHttp.get(environment.server + '/filters/hourlybudget/', options)
      .map((r: Response) => r.json() as RecruitmentFilterModel)
      .catch(this.handleObservableError);
  }
  /*
* Post publishJobModelData to publish Job
*@input publishJobModelData 
*/
publishJob(publishJobModelData: PublishJobModel): Observable<string> {
  const body = JSON.stringify(publishJobModelData);
  const options: RequestOptionsArgs = <RequestOptionsArgs>{};
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  options.headers = headers;

  return this.authHttp.post(environment.server + '/recruitments/job/'+publishJobModelData.project+'/project_jobs/', body, options)
    .map((r: Response) => r.json() as string)
    .catch(this.handleObservableError);
}
/*
* update publishJobModelData to publish Job
*@input publishJobModelData 
*/
  updatePublishJob(publishJobModelData: PublishJobModel): Observable<string> {
    const body = JSON.stringify(publishJobModelData);
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    options.headers = headers;

    return this.authHttp.put(environment.server + `/recruitments/job/${publishJobModelData.id}/`, body, options)
      .map((r: Response) => r.json() as string)
      .catch(this.handleObservableError);
  }
  
  /**
   * Get all job list data
   *
   * @returns all job list data
   */
  getJobList(projectId: number): Observable<PublishJobModel> {
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};

    return this.authHttp.get(environment.server + '/recruitments/job/'+projectId+'/project_jobs/', options)
      .map((r: Response) => r.json() as PublishJobModel)
      .catch(this.handleObservableError);
  }

 /**
   * Get all employee list data on basis of pagination, filters and search
   *
   * @returns all empoyee list data
   */
  list(startPage?, pageSize?,department?,expertise?,role?,experience?,hourlybudget?,availability?,search?): Observable<HireEmployeeModel[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<HireEmployeeModel[]>('employee-job-list', {offset: offset, limit: pageSize,employment_details__departments:department,
        employment_details__functional_areas:expertise, employment_details__role:role,basic_details__total_experience:experience,
        availability_details__hourly_charges:hourlybudget,availability_details__hours_per_day:availability,
        search:search});
      // return this.api.get<HireEmployeeModel[]>('employee-job-list', {offset: offset, limit: pageSize,professional_details__departments:department,
      //   professional_details__expertise:expertise, professional_details__role:role,professional_details__total_experience:experience,
      //   professional_details__hourly_charges:hourlybudget,availability_details__hours_per_day:availability,
      //   search:search});
    }
    return this.api.get<HireEmployeeModel[]>('employee-job-list');
  }

/*
* Post scheduleInterviewData to publish Job
*@input scheduleInterviewData 
*/
scheduleInterview(scheduleInterviewData: ScheduleInterviewModel): Observable<string> {
  const body = JSON.stringify(scheduleInterviewData);
  const options: RequestOptionsArgs = <RequestOptionsArgs>{};
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  options.headers = headers;

  return this.authHttp.post(environment.server + '/recruitments/interview/', body, options)
    .map((r: Response) => r.json() as string)
    .catch(this.handleObservableError);
}

 /**
   * Get all job posting list data on basis of pagination, filters and search
   *
   * @returns all job posting list data
   */
  jobPostingList(startPage?, pageSize?,search?, projectId?): Observable<HireEmployeeModel[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
  
      return this.api.get<HireEmployeeModel[]>(`recruitments/employee-job-response/${projectId}/project_job_response`, {offset: offset, limit: pageSize,search:search});
    }
    return this.api.get<HireEmployeeModel[]>(`recruitments/employee-job-response/${projectId}/project_job_response`);
  }

  /**
   * Get all job posting list data for backer on basis of pagination, filters and search
   *
   * @returns all job posting list data
   */
  jobPostingListForBacker(startPage?, pageSize?,search?, projectId?): Observable<HireEmployeeModel[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
  
      return this.api.get<HireEmployeeModel[]>(`backer-projects/${projectId}/project-job-response`, {offset: offset, limit: pageSize,search:search});
    }
    return this.api.get<HireEmployeeModel[]>(`backer-projects/${projectId}/project-job-response`);
  }

 /**
   * Get all job posting for direct hire list data on basis of pagination, filters and search
   *
   * @returns all job posting for direct hire list data
   */
  directHireJobPostingList(startPage?, pageSize?,search?, projectId?): Observable<HireEmployeeModel[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
  
      return this.api.get<HireEmployeeModel[]>(`recruitments/direct-hire-response/${projectId}/project_interview_response`, {offset: offset, limit: pageSize,search:search});
    }
    return this.api.get<HireEmployeeModel[]>(`recruitments/direct-hire-response/${projectId}/project_interview_response`);
  }

  /**
   * Get all job posting for direct hire list data for backer on basis of pagination, filters and search
   *
   * @returns all job posting for direct hire list data
   */
  directHireJobPostingListForBacker(startPage?, pageSize?,search?, projectId?): Observable<HireEmployeeModel[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
  
      return this.api.get<HireEmployeeModel[]>(`backer-projects/${projectId}/project-interview-response`, {offset: offset, limit: pageSize,search:search});
    }
    return this.api.get<HireEmployeeModel[]>(`backer-projects/${projectId}/project-interview-response`);
  }

  /**
   * Get all my employee list data on basis of pagination, filters and search
   *
   * @returns all my employee list data
   */
  myEmployeeList(startPage?, pageSize?,search?): Observable<HireEmployeeModel[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
  
      return this.api.get<HireEmployeeModel[]>('recruitments/current-employee', {offset: offset, limit: pageSize,search:search});
    }
    return this.api.get<HireEmployeeModel[]>('recruitments/current-employee');
  }

  /**
   * Get all my employee list data for backer on basis of pagination, filters and search
   *
   * @returns all my employee list data
   */
  myEmployeeListForBacker(startPage?, pageSize?,search?, project?): Observable<HireEmployeeModel[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
  
      return this.api.get<HireEmployeeModel[]>(`backer-projects/${project}/current-employees`, {offset: offset, limit: pageSize,search:search});
    }
    return this.api.get<HireEmployeeModel[]>(`backer-projects/${project}/current-employees`);
  }

  /**
   * Get all previous employee list data on basis of pagination, filters and search
   *
   * @returns all previous  employee list data
   */
  previousEmployeeList(startPage?, pageSize?,search?): Observable<HireEmployeeModel[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
  
      return this.api.get<HireEmployeeModel[]>('recruitments/previous-employee', {offset: offset, limit: pageSize,search:search});
    }
    return this.api.get<HireEmployeeModel[]>('recruitments/previous-employee');
  }

  /**
   * Get all previous employee list data for backer on basis of pagination, filters and search
   *
   * @returns all previous  employee list data
   */
  previousEmployeeListForBacker(startPage?, pageSize?,search?, project?): Observable<HireEmployeeModel[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;  
      return this.api.get<HireEmployeeModel[]>(`backer-projects/${project}/previous-employees`, {offset: offset, limit: pageSize,search:search});
    }
    return this.api.get<HireEmployeeModel[]>(`backer-projects/${project}/previous-employees`);
  }

    /**
   * Get all Hire employee data 
   *
   * @returns all Hire employee data
   */
  getHireEmployee(empId): Observable<HireEmployeeData> {
      return this.api.get<HireEmployeeData>(`employee-job-list/${empId}/hire`);
  }
   
  /*
* Post scheduleInterviewData to post Appointment letter
*@input scheduleInterviewData 
*/
sendAppointment(hireEmployeeData:HireEmployeeData): Observable<string> {
  const body = JSON.stringify(hireEmployeeData);
  const options: RequestOptionsArgs = <RequestOptionsArgs>{};
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  options.headers = headers;

  return this.authHttp.post(environment.server + `/employee-job-list/${hireEmployeeData.emp_id}/send_appointment/`, body, options)
    .map((r: Response) => r.json() as string)
    .catch(this.handleObservableError);
}

getProjectById(projectId: number): Observable<ProjectModel> {
  return this.api.get<ProjectModel>(
    `projects/${projectId}`
  );
}

/**
   * Get direct Hire employee data 
   *
   * @returns direct Hire employee data
   */
  getDirectHireEmployee(empId): Observable<HireEmployeeData> {
    return this.api.get<HireEmployeeData>(`recruitments/direct-hire-response/${empId}/hire`);
}

 /*
* Post scheduleInterviewData to post Appointment letter
*@input scheduleInterviewData 
*/
sendDirectHireAppointment(hireEmployeeData:HireEmployeeData): Observable<string> {
  const body = JSON.stringify(hireEmployeeData);
  const options: RequestOptionsArgs = <RequestOptionsArgs>{};
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  options.headers = headers;

  return this.authHttp.post(environment.server + `/recruitments/direct-hire-response/${hireEmployeeData.emp_id}/send_appointment/`, body, options)
    .map((r: Response) => r.json() as string)
    .catch(this.handleObservableError);
}

/**
   * Get my job posting  employee data 
   *
   * @returns my job posting  employee data
   */
  getJobPostingEmployee(empId): Observable<HireEmployeeData> {
    return this.api.get<HireEmployeeData>(`recruitments/employee-job-response/${empId}/hire`);
}

 /*
* Post scheduleInterviewData to post Appointment letter
*@input scheduleInterviewData 
*/
sendJobPostingAppointment(hireEmployeeData:HireEmployeeData): Observable<string> {
  const body = JSON.stringify(hireEmployeeData);
  const options: RequestOptionsArgs = <RequestOptionsArgs>{};
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  options.headers = headers;

  return this.authHttp.post(environment.server + `/recruitments/employee-job-response/${hireEmployeeData.emp_id}/send_appointment/`, body, options)
    .map((r: Response) => r.json() as string)
    .catch(this.handleObservableError);
}

/**
   * Get previous  employee data 
   *
   * @returns previous employee data
   */
  getPreviousEmployee(empId): Observable<HireEmployeeData> {
    return this.api.get<HireEmployeeData>(`recruitments/previous-employee/${empId}/re_hire`);
}
 /*
* Post previous-employeeData to post Appointment letter
*@input employeeData 
*/
sendReHireAppointment(hireEmployeeData:HireEmployeeData): Observable<string> {
  const body = JSON.stringify(hireEmployeeData);
  const options: RequestOptionsArgs = <RequestOptionsArgs>{};
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  options.headers = headers;

  return this.authHttp.post(environment.server + `/recruitments/previous-employee/${hireEmployeeData.emp_id}/send_appointment/`, body, options)
    .map((r: Response) => r.json() as string)
    .catch(this.handleObservableError);
}

   /**
   * Get all employee data to be Fire 
   *
   * @returns FireEmployeeData all employee data to be Fire 
   */
  getFireEmployee(empId): Observable<FireEmployeeData> {
    return this.api.get<FireEmployeeData>(`recruitments/current-employee/${empId}/fire`);
}
 /*
* Post/Put to fire employee
*@input hireEmployeeData 
*/
sendFireRequest(fireEmployeeData:FireEmployeeData): Observable<string> {
  const body = JSON.stringify(fireEmployeeData);
  const options: RequestOptionsArgs = <RequestOptionsArgs>{};
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  options.headers = headers;

  return this.authHttp.post(environment.server + `/recruitments/current-employee/${fireEmployeeData.emp_id}/send_termination/`, body, options)
    .map((r: Response) => r.json() as string)
    .catch(this.handleObservableError);
}

putRejectJobApplication(id) {
  const options: RequestOptionsArgs = <RequestOptionsArgs>{};
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  options.headers = headers;

  return this.authHttp.put(environment.server + `/recruitments/employee-job-response/${id}/reject/`, null, options)
    .map((r: Response) => r.json() as string)
    .catch(this.handleObservableError);
}

/**
   * Get Docu Sign Status 
   *
   * @returns empId and envolop get url or status like 'send', 'completed' etc.
   */
  getDocuSignStatus(empId: number, envolopId: string): Observable<any> {
    return this.api.get<any>(`employee-job-list/${empId}/docusign-status/${envolopId}`);
}

}