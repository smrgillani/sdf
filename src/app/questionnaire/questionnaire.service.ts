import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as _ from 'lodash';

import Question from './models/Question';
import Answer from './models/Answer';
import {ApiService} from 'app/core/api/api.service';


/**
 * Questionnaire Service
 * Service provides functions for operations with project questions and answers
 */
@Injectable()
export class QuestionnaireService {
  cachedQuestions: {
    idea: Question[],
    startup: Question[]
  };

  constructor(
    private api: ApiService
  ) {
    this.cachedQuestions = {
      idea: [],
      startup: []
    };
  }

  /**
   * Get question list for a project
   *
   * @returns list of questions
   */
  getQuestions(stage: 'idea' | 'startup'): Observable<Question[]>  {
    if (this.cachedQuestions[stage].length > 0) {
      return Observable.of(_.cloneDeep(this.cachedQuestions[stage]));
    }
    return this.api.get(`${stage}/questions`)
      .map((questions: Question[]) => {
        this.cachedQuestions[stage] = questions;
        return _.cloneDeep(questions);
      });
  }

  /**
   * Get project answers
   *
   * @param projectId - id of project
   * @returns collection of project answers
   */
  getProjectAnswers(projectId: number, stage:string): Observable<Answer[]> {
    //stage = all for all answers, else idea/startup/registration for specific
    return this.api.get(`projects/${projectId}/answers/${stage}`);
  }

  /**
   * Get published project answers
   *
   * @param projectId - id of project
   * @returns collection of published project answers
   */
  getPublishedAnswers(projectId: number): Observable<Answer[]> {
    return this.api.get(`projects/${projectId}/answers/published`);
  }

  /**
   * Get published project answers
   *
   * @param projectId - id of project
   * @param answers - collection of answers to save
   * @returns list of updated answers
   */
  saveAnswers(answers: Answer[], projectId: number, stage:string): Observable<any> {
    return this.api.post(`projects/${projectId}/answers/stage`, answers);
  }

  /**
   * Create new project
   *
   * @param answers - collection of answers for creating new projects
   * @returns created project data
   */
  createIdea(answers: Answer[], isVisible: boolean): Observable<any> {
    const ideaData = {
      title: answers[0].response_text,
      stage: 'idea',
      is_visible: isVisible
    };

    return Observable.create((observer) => {
      this.api.post('projects', ideaData)
        .subscribe((idea) => {
          this.saveAnswers(answers, idea['id'],'idea')
            .subscribe(() => {
              observer.next(idea['id']);
              observer.complete();
            });
        });
    });
  }
}
