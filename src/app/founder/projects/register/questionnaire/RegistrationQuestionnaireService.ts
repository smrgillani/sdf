import { Injectable } from "@angular/core";
import { ApiService } from "app/core/api/api.service";
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import RegistrationQuestion from "app/founder/projects/register/questionnaire/models/RegistrationQuestion";
import RegistrationAnswer from "app/founder/projects/register/questionnaire/models/RegistrationAnswer";


/**
 * Registration Questionnaire Service
 * Service provides functions for operations with project registration questions and answers
 */
@Injectable()
export class RegistrationQuestionnaireService {
    cachedQuestions: RegistrationQuestion[];

    constructor(
        private api: ApiService
    ) {
        this.cachedQuestions = [];
    }

    /**
     * Get question list for a project
     *
     * @returns list of questions
     */
    getQuestions(entityType: number): Observable<RegistrationQuestion[]> {
        if (this.cachedQuestions.length > 0 && this.cachedQuestions[0].registration_type == entityType) {
            return Observable.of(_.cloneDeep(this.cachedQuestions));
        }
        return this.api.get(`registration/registration_type/${entityType}/questions`)
            .map((questions: RegistrationQuestion[]) => {
                this.cachedQuestions = questions;
                return _.cloneDeep(questions);
            });
    }

    /**
     * Get project answers
     *
     * @param projectId - id of project
     * @returns collection of project answers
     */
    getProjectAnswers(projectId: number, stage:string): Observable<RegistrationAnswer[]> {
        return this.api.get(`projects/${projectId}/answers/${stage}`);
    }

  /**
   * Get published project answers
   *
   * @param projectId - id of project
   * @param answers - collection of answers to save
   * @returns list of updated answers
   */
  saveAnswers(answers: RegistrationAnswer[], projectId: number): Observable<any> {
      console.log('answers to post');
      console.log(answers);
    return this.api.post(`projects/${projectId}/answers/registration`, answers);
  }
}