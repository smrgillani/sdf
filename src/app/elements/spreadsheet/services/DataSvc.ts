'use strict';

import {Injectable} from '@angular/core';
import ProjectAnswerModel from 'app/core/models/ProjectAnswerModel';
import {ApiService} from 'app/core/api/api.service';
import {Observable} from 'rxjs/Rx';

// Common data service
@Injectable()
export class DataSvc {

  public products = ['Widget', 'Gadget', 'Doohickey'];
  public countries = [
    'US',
    'Germany',
    'UK',
    'Japan',
    'Italy',
    'Greece'
  ];

  constructor(private api: ApiService) {
  }


  // get matches for a search term
  getData(count: number): any[] {
    const data = [];
    let i = 0,
      countryId,
      productId;

    for (i = 0; i < count; i++) {
      countryId = Math.floor(Math.random() * this.countries.length);
      productId = Math.floor(Math.random() * this.products.length);
      data.push({
        id: i,
        countryId: countryId,
        productId: productId,
        date: new Date(2014, i % 12, i % 28),
        amount: Math.random() * 10000,
        active: i % 4 === 0
      });
    }
    return data;
  }

  getAnswers(project_id: number): Observable<ProjectAnswerModel[]>  {
    return this.api.get<ProjectAnswerModel[]>(`projects/${project_id}/answers`)
      .map((answers: ProjectAnswerModel[]) => {
        return answers;
      });
  }

  getPublishedAnswers(project_id: number): Observable<ProjectAnswerModel[]>  {
    return this.api.get<ProjectAnswerModel[]>(`projects/${project_id}/answers/published`)
      .map((answers: ProjectAnswerModel[]) => {
        return answers;
      });
  }

  addAnswers(project_id: number, data: ProjectAnswerModel[]): Observable<ProjectAnswerModel[]>  {
    return this.api.post<ProjectAnswerModel[], any>(`projects/${project_id}/answers`, data)
      .map((answers: ProjectAnswerModel[]) => {
        return answers;
      });
  }

}
