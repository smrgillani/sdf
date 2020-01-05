import { Injectable } from '@angular/core';
import { Response, RequestOptionsArgs, Headers } from '@angular/http';
import { StageState } from './../employee/account/stageState';
import { AuthHttp } from 'angular2-jwt';
import { ApiService } from 'app/core/api/api.service';
import { HasId } from 'app/core/interfaces';
import { environment } from '../../environments/environment';
import { EmployeeBasicInfo } from '../employeeprofile/models/employee-basic-info';
import { EmployeeProfessionalInfo, ListingData, ResumeDetail } from '../employeeprofile/models/employee-professional-info';
import { CommonResponse } from 'app/core/api/CommonResponse';
import { Index as EmployeeInfo } from '../employeeprofile/models/index'
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as _ from 'lodash';
import { EmployeeAvailabilityInfo } from 'app/employeeprofile/models/employee-availability-info';
import { EmployeeWorkSampleInfo } from 'app/employeeprofile/models/employee-work-sample-info';
import { EmployeeEmploymentInfo } from 'app/employeeprofile/models/employee-employment-info';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class StageStorage {
  basicInfo: EmployeeBasicInfo;
  employeeInfo: EmployeeInfo;

  protected hasNestedEdits = false;
  constructor(private authHttp: AuthHttp, private api: ApiService) {
    this.employeeInfo = new EmployeeInfo();
  }

  basicInfoDataSubcritption: BehaviorSubject<EmployeeBasicInfo> = new BehaviorSubject<EmployeeBasicInfo>(null);

  /**
   * Get status of a Employee profile stage.
   * If there no object this method create it.
   *
   * @param stage - profile stage, for example 'basic', 'professional' etc
   * @returns state object
   */
  getStageState(stage: string): StageState {
    let stageState = new StageState();
    stageState.stage = stage;
    if (stage == 'basicinfo') {
      if (!this.employeeInfo.basicInfo) {
        this.getBasicInfo().subscribe((obj) => {
          stageState.done = obj.is_completed;
        });
      }
      else {
        stageState.done = this.employeeInfo.basicInfo.is_completed;
      }
    }
    else if (stage == 'professionalinfo') {
      if (this.employeeInfo.professionalInfo && this.employeeInfo.professionalInfo.length == 0) {
        this.getProfessionalInfo().subscribe((obj) => {
          if (obj != undefined && obj.length > 0) {
            stageState.done = obj[0].is_completed;
          }
        });
      }
      else {
        stageState.done = this.employeeInfo.professionalInfo[0].is_completed;
      }

    }
    else if (stage == 'employmentinfo') {
      if (this.employeeInfo.employmentInfo && this.employeeInfo.employmentInfo.length == 0) {
        this.getEmploymentDetails().subscribe((obj) => {
          if (obj != undefined && obj.length > 0) {
            stageState.done = obj[0].is_completed;
          }
        });
      }
      else {
        stageState.done = this.employeeInfo.employmentInfo[0].is_completed;
      }
    }
    else if (stage == 'worksampleinfo') {
      if (this.employeeInfo.worksampleInfo && this.employeeInfo.worksampleInfo.length == 0) {
        this.getWorkDetails().subscribe((obj) => {
          if (obj != undefined && obj.length > 0) {
            stageState.done = obj[0].is_completed;
          }
        });
      }
      else {
        stageState.done = this.employeeInfo.worksampleInfo[0].is_completed;
      }
    }
    else if (stage == 'availabilityinfo') {
      if (!this.employeeInfo.availabilityInfo) {
        this.getAvailabilityDetails().subscribe((obj) => {
          stageState.done = obj.is_completed;
        });
      }
      else {
        stageState.done = this.employeeInfo.availabilityInfo.is_completed;
      }
    }
    // else if(stage == 'contactinfo'){
    //   this.getContactDetails().subscribe((obj)=>{
    //     stageState.done = obj.is_completed;  
    //   });
    // }

    return stageState;
  }

  /**
   * Returns user objects depends on is session is nested.
   *
   * @param isNestedSession - flag, indicate nested session
   * @return - User data depending on session is nested
   */
  getBasicInfo(isNestedSession = false): Observable<EmployeeBasicInfo> {
    if (this.hasNestedEdits || isNestedSession) {
      if (!isNestedSession) {
        this.hasNestedEdits = false;
      }
      if (this.employeeInfo && this.employeeInfo.basicInfo) {
        return Observable.of(_.cloneDeep(this.employeeInfo.basicInfo));
      }
    }
    return this.api.get<any>('employee/basic-details').map((response) => {
      this.employeeInfo.basicInfo = response;
      return _.cloneDeep(this.employeeInfo.basicInfo);
    });
    // return this.authHttp.get(environment.server + '/employee/basic-details/')
    //   .map((response: Response) => {
    //     this.employeeInfo.basicInfo = response.json();
    //     return _.cloneDeep(this.employeeInfo.basicInfo);
    //   });
  }

  setBasicInfo(basicInfo: EmployeeBasicInfo) {
    this.employeeInfo.basicInfo = basicInfo;
  }

  setAvailabilityInfo(availabilityInfo: EmployeeAvailabilityInfo) {
    this.employeeInfo.availabilityInfo = availabilityInfo;
  }

  setEmploymentInfo(employmentInfo: EmployeeEmploymentInfo[]) {
    this.employeeInfo.employmentInfo = employmentInfo;
  }

  setProfessionalInfoInfo(professionalInfo: EmployeeProfessionalInfo[]) {
    this.employeeInfo.professionalInfo = professionalInfo;
  }

  setWorkSampleInfo(workSampleInfo: EmployeeWorkSampleInfo[]) {
    this.employeeInfo.worksampleInfo = workSampleInfo;
  }

  saveNestedSession() {
    this.hasNestedEdits = true;
  }

  /**
   * @param basicInfo 
   * @returns observable of EmployeeBasicInfo
   */
  putBasicInfo<T extends HasId>(basicInfo: T): Observable<EmployeeBasicInfo> {
    // basicinfomain.date_of_birth = moment(basicinfo.date_of_birth).format('YYYY-MM-DD');
    if (basicInfo['photo'] && basicInfo['photo'].indexOf('data:') < 0) {
      delete basicInfo['photo'];
    }
    return this.api.put<T, EmployeeBasicInfo>(
      `employee/basic-details`, basicInfo
    );
  }

  checkPhoneIsValid(phone?: string): Observable<any> {
    if (phone) {
      return this.api.get<any>('phone_verify', { phone_number: phone });
    }
    return Observable.of({ valid: true });
  }

  getProfessionalInfo(isNestedSession = false): Observable<EmployeeProfessionalInfo[]> {
    if (this.hasNestedEdits || isNestedSession) {
      if (!isNestedSession) {
        this.hasNestedEdits = false;
      }
      if (this.employeeInfo && this.employeeInfo.professionalInfo) {
        return Observable.of(_.cloneDeep(this.employeeInfo.professionalInfo));
      }
    }
    console.log('yakkoo professional info');
    return this.api.get<any>('employee/professional-details').map((response) => {
      this.employeeInfo.professionalInfo = response;
      return _.cloneDeep(this.employeeInfo.professionalInfo);
    });
    // return this.authHttp.get(environment.server + '/employee/professional-details/')
    //   .map((response: Response) => {
    //     this.employeeInfo.professionalInfo = response.json();

    //     return _.cloneDeep(this.employeeInfo.professionalInfo);
    //   });
  }

  handleObservableError(error: any) {
    return Observable.throw(error.json().error || error.json());
  }

  getCompleteEmployeeInfo(id: number): Observable<any> {
    return this.api.get<any>(`employee-profile/${id}`);
  }

  getResumeBasedOnId(id: number): Observable<any> {
    console.log('yakkoo get resume on id');
    return this.api.getForFile<any>(`employee/resume/${id}/download`);

    // return this.authHttp.get(environment.server + `/employee/resume/${id}/download/`)
    //   .map((response: Response) => {
    //     return response;
    //   });
  }

  /**
   * get Highest Qualification 
   * @returns observable of ListingData
   */
  getHighestQualification(): Observable<ListingData[]> {
    console.log('yakkoo highest-qualification-list');
    return this.api.get<any>('highest-qualification-list').map((response) => {
      const highestQualification: ListingData[] = response;
      return highestQualification;
    });

    // return this.authHttp.get(environment.server + '/highest-qualification-list/')
    //   .map((response: Response) => {
    //     const highestQualification: ListingData[] = response.json();

    //     return highestQualification;
    //   });
  }

  /**
   * get Campus List 
   * @returns observable of ListingData
   */
  getCampusList(universityId): Observable<ListingData[]> {
    console.log('yakkoo campus list');
    return this.api.get<any>(`university-list/${universityId}/campuses`).map((response) => {
      const campusList: ListingData[] = response;
      return campusList;
    });

    // return this.authHttp.get(environment.server + `/university-list/${universityId}/campuses/`)
    //   .map((response: Response) => {
    //     const campusList: ListingData[] = response.json();
    //     return campusList;
    //   });
  }

  /**
 * get Program List 
 * @returns observable of ListingData
 */
  getProgramList(qualificationId): Observable<ListingData[]> {
    console.log('yakkoo program list');
    return this.api.get<any>(`highest-qualification-list/${qualificationId}/programs`).map((response) => {
      const list: ListingData[] = response;
      return list;
    });
    // return this.authHttp.get(environment.server + `/highest-qualification-list/${qualificationId}/programs/`)
    //   .map((response: Response) => {
    //     const programList: ListingData[] = response.json();
    //     return programList;
    //   });
  }

  /**
   * get Expertise List
   * @returns observable of ListingData
   */
  getExpertiseList(): Observable<ListingData[]> {
    console.log('yakkoo expertise-list');
    return this.api.get<any>(`expertise-list`).map((response) => {
      const list: ListingData[] = response;
      return list;
    });
    // return this.authHttp.get(environment.server + '/expertise-list/')
    //   .map((response: Response) => {
    //     const expertiseList: ListingData[] = response.json();
    //     return expertiseList;
    //   });
  }

  /**
   * get University  List
   * @returns observable of ListingData
   */
  getUniversityList(): Observable<ListingData[]> {
    console.log('yakkoo university-list');
    return this.api.get<any>(`university-list`).map((response) => {
      const list: ListingData[] = response;
      return list;
    });
    // return this.authHttp.get(environment.server + '/university-list/')
    //   .map((response: Response) => {
    //     const universityList: ListingData[] = response.json();
    //     return universityList;
    //   });
  }

  /**
   * get Role List
   * @returns observable of ListingData
   */
  getRoleList(): Observable<ListingData[]> {
    console.log('yakkoo role-list');
    return this.api.get<any>(`role-list`).map((response) => {
      const list: ListingData[] = response;
      return list;
    });

    // return this.authHttp.get(environment.server + '/role-list/')
    //   .map(response => response.json() as ListingData[])
    //   .catch(this.handleObservableError);
  }

  /**
   * get Department List
   * @returns observable of ListingData
   */
  getDepartmentList(): Observable<ListingData[]> {
    console.log('yakkoo filters/department');
    return this.api.get<any>(`filters/department`).map((response) => {
      const list: ListingData[] = response;
      return list;
    });
    // return this.authHttp.get(environment.server + '/filters/department/')
    //   .map((response: Response) => {
    //     const roleList: ListingData[] = response.json();
    //     return roleList;
    //   });
  }

  /**
  * get Total ExperienceList
  * @returns observable of ListingData
  */
  getTotalExperienceList(): Observable<ListingData[]> {
    console.log('yakkoo filters/experience');
    return this.api.get<any>(`filters/experience`).map((response) => {
      const list: ListingData[] = response;
      return list;
    });
    // return this.authHttp.get(environment.server + '/filters/experience/')
    //   .map((response: Response) => {
    //     const totalExperienceList: ListingData[] = response.json();
    //     return totalExperienceList;
    //   });
  }

  /**
   * get Country List 
   * @returns observable of ListingData
   */
  getCountryList(): Observable<ListingData[]> {
    console.log('yakkoo country-list');
    return this.api.get<any>(`country-list`).map((response) => {
      const list: ListingData[] = response;
      return list;
    });
    // return this.authHttp.get(environment.server + '/country-list/')
    //   .map((response: Response) => {
    //     const CountryList: ListingData[] = response.json();
    //     return CountryList;
    //   });
  }

  /**
   * get State List through Country ID
   * @returns observable of ListingData
   */
  getStateList(countryId): Observable<ListingData[]> {
    console.log('yakkoo state-list');
    return this.api.get<any>(`country-list/${countryId}/states`).map((response) => {
      const list: ListingData[] = response;
      return list;
    });
    // return this.authHttp.get(environment.server + `/country-list/${countryId}/states/`)
    //   .map((response: Response) => {
    //     const stateList: ListingData[] = response.json();
    //     return stateList;
    //   });
  }

  /**
   * get days Per Year List 
   * @returns observable of ListingData
   */
  getDaysPerYearList(): Observable<ListingData[]> {
    console.log('yakkoo days per year');
    return this.api.get<any>(`availabilitydaysperyear-list`).map((response) => {
      const list: ListingData[] = response;
      return list;
    });
    // return this.authHttp.get(environment.server + '/availabilitydaysperyear-list/')
    //   .map((response: Response) => {
    //     const daysPerYearList: ListingData[] = response.json();
    //     return daysPerYearList;
    //   });
  }

  /**
   * get days Per Year List 
   * @returns observable of ListingData
   */
  getHourlyBudgetList(): Observable<ListingData[]> {
    console.log('yakkoo hourlybudget');
    return this.api.get<any>(`filters/hourlybudget`).map((response) => {
      const list: ListingData[] = response;
      return list;
    });
    // return this.authHttp.get(environment.server + '/filters/hourlybudget/')
    //   .map((response: Response) => {
    //     const budgetList: ListingData[] = response.json();
    //     return budgetList;
    //   });
  }

  /**
   * get availability Deatil
   * @returns observable of EmployeeAvailabilityInfo
   */
  getAvailabilityDetails(isNestedSession = false): Observable<EmployeeAvailabilityInfo> {
    if (this.hasNestedEdits || isNestedSession) {
      if (!isNestedSession) {
        this.hasNestedEdits = false;
      }
      if (this.employeeInfo && this.employeeInfo.availabilityInfo) {
        return Observable.of(_.cloneDeep(this.employeeInfo.availabilityInfo));
      }
      // else {
      //   return this.authHttp.get(environment.server + '/employee/availability/')
      //     .map((response: Response) => {
      //       this.employeeInfo.availabilityInfo = response.json();
      //       return _.cloneDeep(this.employeeInfo.availabilityInfo);
      //     });
      // }
    }
    console.log('yakkoo availability info');
    return this.api.get<any>('employee/availability').map((response) => {
      this.employeeInfo.availabilityInfo = response;
      return _.cloneDeep(this.employeeInfo.availabilityInfo);
    });
    // return this.authHttp.get(environment.server + '/employee/availability/')
    //   .map((response: Response) => {
    //     this.employeeInfo.availabilityInfo = response.json();
    //     return _.cloneDeep(this.employeeInfo.availabilityInfo);
    //   });
  }

  /**
 * Update availability Info   
 * @param availabilityInfo 
 * @returns observable of EmployeeAvailabilityInfo
 */
  putAvailabilityInfo<T extends HasId>(availabilityInfo: T): Observable<EmployeeAvailabilityInfo> {
    return this.api.put<T, EmployeeAvailabilityInfo>(
      `employee/availability`, availabilityInfo
    );
  }

  /**
 * get workDeatil
 * @returns observable of EmployeeWorkSampleInfo
 */
  getWorkDetails(isNestedSession = false): Observable<EmployeeWorkSampleInfo[]> {
    if (this.hasNestedEdits || isNestedSession) {
      if (!isNestedSession) {
        this.hasNestedEdits = false;
      }
      //this.basicInfo = Observable.of(this.basicInfo);
      if (this.employeeInfo && this.employeeInfo.worksampleInfo) {
        return Observable.of(_.cloneDeep(this.employeeInfo.worksampleInfo));
      }
      // else {
      //   return this.authHttp.get(environment.server + '/employee/work-details/')
      //     .map((response: Response) => {
      //       this.employeeInfo.worksampleInfo = response.json();
      //       return _.cloneDeep(this.employeeInfo.worksampleInfo);
      //     });
      // }
    }
    console.log('yakkoo work-details info');
    return this.api.get<any>('employee/work-details').map((response) => {
      this.employeeInfo.worksampleInfo = response;
      return _.cloneDeep(this.employeeInfo.worksampleInfo);
    });
    // return this.authHttp.get(environment.server + '/employee/work-details/')
    //   .map((response: Response) => {
    //     this.employeeInfo.worksampleInfo = response.json();
    //     return _.cloneDeep(this.employeeInfo.worksampleInfo);
    //   });
  }

  /**
   * get team List 
   * @returns observable of ListingData
   */
  getTeamList(): Observable<ListingData[]> {
    console.log('yakkoo teamsize-list');
    return this.api.get<any>(`teamsize-list`).map((response) => {
      const list: ListingData[] = response;
      return list;
    });
    // return this.authHttp.get(environment.server + '/teamsize-list/')
    //   .map((response: Response) => {
    //     const teamList: ListingData[] = response.json();
    //     return teamList;
    //   });
  }

  /**
  * Post  work Info  
  * @param workInfo 
  */
  postWorkInfo(workInfo: EmployeeWorkSampleInfo[]): Observable<string> {
    console.log('post work');
    return this.api.post(`employee/work-details`, workInfo);
    // const body = JSON.stringify(workInfo);
    // const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    // const headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    // options.headers = headers;

    // return this.authHttp.post(environment.server + '/employee/work-details/', body, options)
    //   .map((r: Response) => r.json() as string)
    //   .catch(this.handleObservableError);
  }

  /**
  * Put workInfo 
  * @param workInfo 
  */
  putWorkInfo(workInfo: EmployeeWorkSampleInfo): Observable<string> {
    console.log('put work');
    return this.api.put(`employee/work-details/${workInfo.id}`, workInfo);
    // const body = JSON.stringify(workInfo);
    // const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    // const headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    // options.headers = headers;

    // return this.authHttp.put(environment.server + `/employee/work-details/${workInfo.id}/`, body, options)
    //   .map((r: Response) => r.json() as string)
    //   .catch(this.handleObservableError);
  }

  /**
 * get Functional Area List
 * @returns observable of ListingData
 */
  getFunctionalAreaList(): Observable<ListingData[]> {
    console.log('yakkoo functional area list');
    return this.api.get<any>(`expertise-list`).map((response) => {
      const list: ListingData[] = response;
      return list;
    });
    // return this.authHttp.get(environment.server + '/expertise-list/')
    //   .map(response => response.json() as ListingData[])
    //   .catch(this.handleObservableError);
  }

  /**
 * get Employment
 * @returns observable of EmployeeEmploymentInfo
 */
  getEmploymentDetails(isNestedSession = false): Observable<EmployeeEmploymentInfo[]> {
    if (this.hasNestedEdits || isNestedSession) {
      if (!isNestedSession) {
        this.hasNestedEdits = false;
      }
      //this.basicInfo = Observable.of(this.basicInfo);
      if (this.employeeInfo && this.employeeInfo.employmentInfo) {
        return Observable.of(_.cloneDeep(this.employeeInfo.employmentInfo));
      }
      // else {
      //   return this.authHttp.get(environment.server + '/employee/employment-details/')
      //     .map((response: Response) => {
      //       this.employeeInfo.employmentInfo = response.json();

      //       return _.cloneDeep(this.employeeInfo.employmentInfo);
      //     });
      // }
    }
    console.log('yakkoo employment-details');
    return this.api.get<any>('employee/employment-details').map((response) => {
      this.employeeInfo.employmentInfo = response;
      return _.cloneDeep(this.employeeInfo.employmentInfo);
    });
    // return this.authHttp.get(environment.server + '/employee/employment-details/')
    //   .map((response: Response) => {
    //     this.employeeInfo.employmentInfo = response.json();

    //     return _.cloneDeep(this.employeeInfo.employmentInfo);
    //   });
  }

  /**
 * Post employment Info
 * @param employmentInfo 
 * @returns observable of EmployeeEmploymentInfo
 */
  postEmploymentInfo(employmentInfo: EmployeeEmploymentInfo[]): Observable<string> {
    // console.log('post employmentInfo');
    return this.api.post(`employee/employment-details`, employmentInfo);

    // const body = JSON.stringify(employmentInfo);
    // const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    // const headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    // options.headers = headers;

    // return this.authHttp.post(environment.server + '/employee/employment-details/', body, options)
    //   .map((r: Response) => r.json() as string)
    //   .catch(this.handleObservableError);
  }

  /**
  * Post Employment Info 
  * @param employmentInfo 
  */
  putEmploymentInfo<T extends HasId>(employmentInfo: T): Observable<EmployeeEmploymentInfo> {
    // console.log('putEmploymentInfo');
    return this.api.put<T, EmployeeEmploymentInfo>(
      `employee/employment-details`, employmentInfo
    );
  }

  /**
* Post Professional Info
* @param professionalInfo 
* @returns observable of EmployeeProfessionalInfo
*/
  postProfessionalInfo(professioalInfo: EmployeeProfessionalInfo[]): Observable<string> {
    console.log('post professioalInfo');
    return this.api.post(`employee/professional-details`, professioalInfo);

    // const body = JSON.stringify(professioalInfo);
    // const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    // const headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    // options.headers = headers;

    // return this.authHttp.post(environment.server + '/employee/professional-details/', body, options)
    //   .map((r: Response) => r.json() as string)
    //   .catch(this.handleObservableError);
  }

  putResume(resumeData: ResumeDetail): Observable<string> {
    console.log('put resume');
    return this.api.put(`resume`, resumeData);

    // const body = JSON.stringify(resumeData);
    // const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    // const headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    // options.headers = headers;

    // return this.authHttp.put(environment.server + '/resume/', body, options)
    //   .map((r: Response) => r.json() as string)
    //   .catch(this.handleObservableError);
  }

  getResume(): Observable<ResumeDetail> {
    console.log('yakkoo get resume');
    return this.api.get<ResumeDetail>(`resume`);
    // return this.authHttp.get(environment.server + '/resume/')
    //   .map(response => response.json() as ResumeDetail)
    //   .catch(this.handleObservableError);
  }

  /**
  * Delete professional rec
  *
  * @param professionalRec - should haveid
  * @returns {Observable<R|T>}
  */
  deleteProfessional<T extends HasId>(professionalRec: T): Observable<EmployeeProfessionalInfo> {
    return this.api.delete(`employee/professional-details/${professionalRec.id}`);
  }

  /**
* Delete Employment rec
*
* @param employmentRec - should haveid
* @returns {Observable<R|T>}
*/
  deleteEmployment<T extends HasId>(employmentRec: T): Observable<EmployeeEmploymentInfo> {
    return this.api.delete(`employee/employment-details/${employmentRec.id}`);
  }

  /**
   * Delete work Sample  rec
   *
   * @param workRec - should haveid
   * @returns {Observable<R|T>}
   */
  deleteWorkSample<T extends HasId>(workRec: T): Observable<EmployeeWorkSampleInfo> {
    return this.api.delete(`employee/work-details/${workRec.id}`);
  }

  /*
  *get hobbies as a predictive serach
  */
  getHobbies(search?): Observable<string[]> {
    // return this.authHttp.get(environment.server + '/hobbies-list/')
    // .map(response => response.json() as string[] )
    // .catch(this.handleObservableError);
    return this.api.get<string[]>('hobbies-list', { search: search });
  }

  getSelfInfo(id: number): Observable<any> {
    return this.api.get<any>(`employee-profile/${id}`);
  }

  getAllCategory(): Observable<any> {
    return this.api.get<any>('filters/department');
  }

  getAllSubCategory(): Observable<any> {
    return this.api.get<any>('role-list');
  }

  getAllAvailability(): Observable<any> {
    return this.api.get<any>('filters/availability');
  }

  getAllExpertise(): Observable<any> {
    return this.api.get<any>('expertise-list');
  }

  getAllExperience(): Observable<any> {
    return this.api.get<any>('filters/experience');
  }

  getAllHourlyBudget(): Observable<any> {
    return this.api.get<any>('filters/hourlybudget');
  }

  getJobList(startPage?, pageSize?, categories?, expertise?, experience?, sub_categories?, hourlybudget?, availability?): Observable<any[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any[]>('job-list', { offset: offset, limit: pageSize, department: categories, expertise: expertise, experience: experience, role: sub_categories, hourlybudget: hourlybudget, availability: availability });
    }
    return this.api.get<any[]>('job-list');
  }

  getJobApply(startPage?, pageSize?): Observable<any[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any[]>('job-apply', { offset: offset, limit: pageSize });
    }
    return this.api.get<any[]>('job-apply');
  }

  applyMyJob(job: any): Observable<any> {
    return this.api.post(`job-apply`, job);
  }

  getAppliedRecuiterInterviewReqSchedule(id: number): Observable<any> {
    return this.api.get<any>(`job-apply/${id}/interview`);
  }

  putRejectAppliedRecuiterInterviewReqSchedule<T extends HasId>(interviewData: T, id: number): Observable<any> {
    return this.api.put<T, any>(
      `job-apply/${id}/reject_interview`, interviewData
    );
  }

  putRejectRecuiterInterviewReqSchedule<T extends HasId>(interviewData: T, id: number): Observable<any> {
    return this.api.put<T, any>(
      `recruitments/direct-interview-list/${id}/reject_interview`, interviewData
    );
  }

  getInterviewRecuiterInterviewReqSchedule(id: number): Observable<any> {
    return this.api.get<any>(`recruitments/direct-interview-list/${id}`);
  }

  putRejectAppliedRecuiterReqJoin<T extends HasId>(appointmentData: T, id: number): Observable<any> {
    return this.api.put<T, any>(
      `job-apply/${id}/reject_offer`, appointmentData
    );
  }

  putRejectRecuiterReqJoin<T extends HasId>(appointmentData: T, id: number): Observable<any> {
    return this.api.put<T, any>(
      `recruitments/direct-interview-list/${id}/reject_offer`, appointmentData
    );
  }

  putRejectDirectHireReqJoin<T extends HasId>(appointmentData: T, id: number): Observable<any> {
    return this.api.put<T, any>(
      `recruitments/direct-hire-list/${id}/reject_offer`, appointmentData
    );
  }

  getDirectHireReqJoin(id: number): Observable<any> {
    return this.api.get<any>(`recruitments/direct-hire-list/${id}/join`);
  }

  getAppliedRecuiterInterviewReqJoin(id: number): Observable<any> {
    return this.api.get<any>(`job-apply/${id}/join`);
  }

  getRecuiterInterviewReq(startPage?, pageSize?): Observable<any[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any[]>('recruitments/direct-interview-list', { offset: offset, limit: pageSize });
    }
    return this.api.get<any[]>('recruitments/direct-interview-list');
  }

  getRecuiterDirectHireReq(startPage?, pageSize?): Observable<any[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any[]>('recruitments/direct-hire-list', { offset: offset, limit: pageSize });
    }
    return this.api.get<any[]>('recruitments/direct-hire-list');
  }

  getRecuiterInterviewReqSchedule(id: number): Observable<any> {
    return this.api.get<any>(`recruitments/direct-interview-list/${id}`);
  }

  getRecuiterInterviewReqJoin(id: number): Observable<any> {
    return this.api.get<any>(`recruitments/direct-interview-list/${id}/join`);
  }

  /**
   * Update when employee accept the offer from recuiter
   * @param appointmentData
   * @returns observable of any
   */
  putRecuiterDirectReqJoin<T extends HasId>(appointmentData: T, id: number): Observable<any> {
    return this.api.put<T, any>(
      `recruitments/direct-interview-list/${id}/join`, appointmentData
    );
  }

  /**
   * Update when employee accept the offer from recuiter
   * @param appointmentData
   * @returns observable of any
   */
  putAppliedJobJoin<T extends HasId>(appointmentData: T, id: number): Observable<any> {
    return this.api.put<T, any>(
      `job-apply/${id}/join`, appointmentData
    );
  }

  putDirectJoin<T extends HasId>(appointmentData: T, id: number): Observable<any> {
    return this.api.put<T, any>(
      `recruitments/direct-hire-list/${id}/join`, appointmentData
    );
  }

  getOngoingProjectList(startPage?, pageSize?): Observable<any> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any>('employee/ongoing-projects', { offset: offset, limit: pageSize });
    }
    return this.api.get<any>('employee/ongoing-projects');
  }

  getPastProjectList(startPage?, pageSize?, searchText?): Observable<any> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      const title = searchText;
      const owner__userprofile__first_name = searchText;
      const owner__userprofile__last_name = searchText;
      return this.api.get<any>('employee/past-projects', {
        offset: offset, limit: pageSize, title: title,
        owner__userprofile__first_name: owner__userprofile__first_name, owner__userprofile__last_name: owner__userprofile__last_name
      });
    }
    return this.api.get<any>('employee/past-projects');
  }

  /*postRescheduleInterview<T extends HasId>(rescheduleData: T): Observable<any> {
    return this.api.put<T, any>(
      `recruitments/interview-reschedule`, rescheduleData
    );
  }*/
  postRescheduleInterview(rescheduleData: any): Observable<string> {
    console.log('post postRescheduleInterview');
    return this.api.post(`recruitments/interview-reschedule`, rescheduleData);

    // const body = JSON.stringify(rescheduleData);
    // const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    // const headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    // options.headers = headers;

    // return this.authHttp.post(environment.server + '/recruitments/interview-reschedule/', body, options)
    //   .map((r: Response) => r.json() as string)
    //   .catch(this.handleObservableError);
  }

  putRescheduleInterviewByCreator<T extends HasId>(data: T): Observable<any> {
    return this.api.put<T, any>(
      `recruitments/interview-reschedule/${data.id}`, data
    );
  }

  confirmInterviewAvailability<T extends HasId>(data: T, isApplyFor: boolean): Observable<any> {
    if (isApplyFor) {
      return this.api.put<T, any>(
        `job-apply/${data.id}/interview`, data
      );
    } else {
      return this.api.put<T, any>(
        `recruitments/direct-interview-list/${data.id}`, data
      );
    }
  }

  searchEmployer(term: string) {
    if (term === '') {
      return Observable.of([]);
    }

    return this.api.get(`employer-search`, { q: term })
      .map((response) => response);
  }

  getFounderList(startPage?, pageSize?, searchText?): Observable<any> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any>('ongoing-creator-list', { offset: offset, limit: pageSize, serach: searchText });
    }
    return this.api.get<any>('ongoing-creator-list');
  }

  getBounusRequestList(): Observable<any> {
    return this.api.get(`bonus-requests`);
  }

  getHikeRequestList(): Observable<any> {
    return this.api.get(`hike-requests`);
  }

  getQuitJobRequestList(): Observable<any> {
    return this.api.get(`quit-job-requests`);
  }

  getBounusRequest(id): Observable<any> {
    return this.api.get(`bonus-requests/${id}`);
  }

  getHikeRequest(id): Observable<any> {
    return this.api.get(`hike-requests/${id}`);
  }

  getQuitJobRequest(id): Observable<any> {
    return this.api.get(`quit-job-requests/${id}`);
  }

  postBounusRequest(data): Observable<any> {
    return this.api.post(`bonus-requests`, data);
  }

  postHikeRequest(data): Observable<any> {
    return this.api.post(`hike-requests`, data);
  }

  postQuitJobRequest(data): Observable<any> {
    return this.api.post(`quit-job-requests`, data);
  }

  putBounusRequest(data): Observable<any> {
    return this.api.put(`bonus-requests/${data.id}`, data);
  }

  putHikeRequest(data): Observable<any> {
    return this.api.put(`hike-requests/${data.id}`, data);
  }

  putQuitJobRequest(data): Observable<any> {
    return this.api.put(`quit-job-requests/${data.id}`, data);
  }
}
