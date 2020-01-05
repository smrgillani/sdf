import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import * as moment from 'moment';

import {ApiService} from 'app/core/api/api.service';
import {HasId} from 'app/core/interfaces';
import MilestoneModel from './models/MilestoneModel';
import { Http } from '@angular/http';


@Injectable()
export class MilestonesService {
  constructor(
    private api: ApiService,
    private http: Http
  ) {
  }

  /**
   * Fetch milestone list from server in the context of a project
   *
   * @param projectId
   * @returns list of all project's milestones
   */
  list(projectId: number): Observable<MilestoneModel[]> {
    return this.api.get<MilestoneModel[]>(`projects/${projectId}/milestones`)
      .map((milestones) => {
        for (const milestone of milestones) {
          milestone.date_start = moment(milestone.date_start).toDate();
          milestone.date_end = moment(milestone.date_end).toDate();
        }
        return milestones;
      });
  }

  /**
   * Fetch milestone list from server in the context of a project for backer
   *
   * @param projectId
   * @returns list of all project's milestones
   */
  listForBacker(projectId: number): Observable<MilestoneModel[]> {
    return this.api.get<MilestoneModel[]>(`backer-projects/${projectId}/milestones`)
      .map((milestones) => {
        for (const milestone of milestones) {
          milestone.date_start = moment(milestone.date_start).toDate();
          milestone.date_end = moment(milestone.date_end).toDate();
        }
        return milestones;
      });
  }

  /**
   * Creates new milestone on server
   *
   * @param milestone
   * @returns observable of MilestoneModel
   */
  create(milestone: MilestoneModel): Observable<MilestoneModel> {
    return this.api.post(`milestones`, milestone);
  }

  /**
   * Update milestone on server
   *
   *
   * @param milestone - should have id
   * @returns observable of MilestoneModel
   */
  update<T extends HasId>(milestone: T): Observable<MilestoneModel> {
    return this.api.put<T, MilestoneModel>(
      `milestones/${milestone.id}`, milestone
    );
  }

  /**
   * Get milestone on server
   *
   *
   * @param milestone - should have id
   * @returns observable of MilestoneModel
   */
  get<T extends HasId>(milestone: T): Observable<MilestoneModel> {    
    return this.api.get<MilestoneModel>(
      `milestones/${milestone.id}`, milestone
    );
  }

  /**
   * Delete milestone on server
   *
   * @param milestone - should haveid
   * @returns {Observable<R|T>}
   */
  delete<T extends HasId>(milestone: T): Observable<any> {
    return this.api.delete(`milestones/${milestone.id}`);
  }

  getMilestone(projectId: number, milestoneId: number): Observable<MilestoneModel> {
    return this.api.get<MilestoneModel>(`milestones/${milestoneId}`)
      .map((milestones) => {
        return milestones;
      });
  }

  getMilestoneForBacker(projectId: number, milestoneId: number): Observable<MilestoneModel> {
    return this.api.get<MilestoneModel>(`backer-projects/${projectId}/milestones/${milestoneId}`)
      .map((milestones) => {
        return milestones;
      });
  }

  getGoalMileStoneList(id: number): Observable<any>{
    return this.api.get<MilestoneModel>(`idea/tasks/${id}/milestone-list`)
      .map((milestones) => {
        return milestones;
      });
  }

  getMilestoneCategoryImages() : Observable<any> {
    return this.http.get('assets/json/milestoneImages.json').map(
      (response) => response.json()
    )
  }

  /**
   * Fetch milestone list from server in the context of a project for backer
   *
   * @param projectId
   * @returns list of all project's milestones
   */
  backerMilestonelist(projectId: number): Observable<MilestoneModel[]> {
    return this.api.get<MilestoneModel[]>(`backer-projects/${projectId}/milestones`)
      .map((milestones) => {
        for (const milestone of milestones) {
          milestone.date_start = moment(milestone.date_start).toDate();
          milestone.date_end = moment(milestone.date_end).toDate();
        }
        return milestones;
      });
  }

  /**
   * Fetch milestone list from server in the context of a project
   *
   * @param projectId
   * @param milestoneId
   * @returns list of all activities for milestone
   */
  getMilestoneActivity(projectId: number, milestoneId: number,startPage?, pageSize?): Observable<any> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any>(`projects/${projectId}/milestones/${milestoneId}/activity`, { offset: offset, limit: pageSize })
      .map((response) => {
        return response;
      });
    }    
    return this.api.get<any>(`projects/${projectId}/milestones/${milestoneId}/activity`)
      .map((response) => {
        return response;
      });
  }
}
