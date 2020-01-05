import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';

import {ApiService} from 'app/core/api/api.service';
import {HasId} from 'app/core/interfaces';
import { EmployeeRateInfo, ParameterInfo, CurrentEmployeeRating } from './models/rating-model';

@Injectable()
export class EmployeeRatingService {

  constructor(private api: ApiService) { }

  /**
   * Get project for task data
   *
   * @param empId - id of employee
   * @returns Project with its task data
   */
  getEmpProjectsTasks(empId: number): Observable<EmployeeRateInfo[]> {
    return this.api.get<EmployeeRateInfo[]>( `recruitments/current-employee/${empId}/completed-tasks`);
  }

  /**
   * Get project for task data
   *
   * @param processId - processid of Creator
   * @returns Project with its task data
   */
  getCreatorProjectTask(processId: number): Observable<EmployeeRateInfo[]> {
    return this.api.get<EmployeeRateInfo[]>( `idea/tasks/${processId}/creator-task-ratings`);
  }

  /**
   * Get project data
   *
   * @param Id - id of AccessList for Backer
   * @returns Project data
   */
  getBackerProject(id: number): Observable<EmployeeRateInfo[]> {
    return this.api.get<EmployeeRateInfo[]>( `backer-access-update/${id}/backer-project-ratings`);
  }

  /**
   * Get project data
   *
   * @returns Parameter List for rating
   */
  getParameterInfoList(): Observable<ParameterInfo[]> {
    return this.api.get<ParameterInfo[]>( `parameter-list`);
  }

  postRateEmployee(employeRatedInfo: any): Observable<any> {
    return this.api.post(`employee-ratings`, employeRatedInfo);
  }

  /**
   * Get current rating form employer
   *
   * @param empId - id of employee
   * @returns employrr rating with it's name.
   */
  getEmpCurrentRating(empId: number): Observable<CurrentEmployeeRating> {
    return this.api.get<CurrentEmployeeRating>( `recruitments/current-employee/${empId}/ratings`);
  }

  /**
   * Get current rating form employer
   *
   * @param empId - id of creator
   * @returns employrr rating with it's name.
   */
  getCreatorCurrentRating(empId: number, rated_to: string): Observable<CurrentEmployeeRating> {
    return this.api.get<CurrentEmployeeRating>( `user-average-rating`, {user: empId, rated_to: rated_to});
  }

}
