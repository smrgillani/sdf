import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import * as _ from 'lodash';

import {AuthService} from 'app/auth/auth.service';
import StageState from './StageState';
import Answer from './models/Answer';
import Question from './models/Question';
import {QuestionnaireService} from './questionnaire.service';
import { BehaviorSubject } from 'rxjs';


/**
 * Service for saving questionnaires state.
 */
@Injectable()
export class StageStorage {
  loadStagesEvent: BehaviorSubject<any>;
  protected stages: _.Dictionary<StageState> = {};

  constructor(
    private auth: AuthService,
    private questionnaireService: QuestionnaireService
  ) {
    this.loadStagesEvent = new BehaviorSubject(null);
    auth.loginEvent.subscribe(() => this.clear());
    auth.logoutEvent.subscribe(() => this.clear());
  }

  protected getKey(stage: string, projectId?: number): string {
    return `${projectId || 'new'}-${stage}`;
  }

  /**
   * Get status and answers of a project stage.
   * If there no object this method create it.
   *
   * @param stage - questionnaire stage, for example 'express', 'develop' etc
   * @param projectId - project id
   * @returns state object
   */
  getStageState(stage: string, projectId?: number): StageState {
    const key = this.getKey(stage, projectId);
    let stageState = this.stages[key];
    if (!stageState) {
      stageState = new StageState();
      stageState.stage = stage;
      stageState.projectId = projectId;
      this.stages[key] = stageState;
    }
    return stageState;
  }

  /**
   * Get all saved stage for project.
   *
   * @param projectId - project id
   * @returns dictionary where the key is stage name and the value is the stage state
   */
  getStagesState(projectId?: number): _.Dictionary<StageState> {
    const stages = {};
    for (const stageState of _.values(this.stages)) {
      if (stageState.projectId === projectId) {
        stages[stageState.stage] = stageState;
      }
    }
    return stages;
  }

  /**
   * Loads answers from server and caches objects.
   * So you can get it using getStagesState or getStageState.
   *
   * @param projectId - project id
   * @returns observable of current loaded stage state.
   */
  loadAnswers(projectId: number, projectStage: 'idea' | 'startup'): Observable<StageState> {
    return Observable.create((observer) => {
      // console.log(`loading answers`);
      this.questionnaireService.getQuestions(projectStage)
        .subscribe((questions: Question[]) => {
          // console.log(`got questions`);
          // console.log(questions);
          this.questionnaireService.getProjectAnswers(projectId,projectStage)
            .subscribe((answers: Answer[]) => {
              // console.log(`got answers`);
              // console.log(answers);
              const groups = _.groupBy(questions, 'group');

              for (const group of _.keys(groups)) {
                const stageState = this.getStageState(group, projectId);
                //const groupQuestions = groups[group];
                const groupQuestions = _.orderBy(groups[group], ['order']);
                stageState.answers = [];
                groupQuestions.forEach((q)=>{
                  if(answers.find(a=>a.question == q.pk)){
                    stageState.answers.push(answers.find(a=>a.question == q.pk));
                  }
                });

                // stageState.answers = answers.filter(
                //   (a) => _.find(groupQuestions, {pk: a.question})
                // );       

                const lastAnswer = _.last(stageState.answers);
                if (lastAnswer) {
                  const lastIndex = _.findIndex(groupQuestions, (q) => q.pk === lastAnswer.question);
                  // console.log(`last index = ${lastIndex}`);
                  // console.log(groupQuestions);
                  if (lastIndex + 1 < groupQuestions.length) {
                    stageState.nextQuestion = groupQuestions[lastIndex + 1].pk;
                  }
                }
                stageState.done = stageState.answers.length === groupQuestions.length;
                observer.next(stageState);
              }
              this.loadStagesEvent.next(null);
              observer.complete();
              // console.log(`end answers`);
            });
        });
    });
  }

  /**
   * Clear new project temporary states from the localStorage.
   */
  clear() {
    this.stages = {};
    localStorage.removeItem('tempQuestionnaires');
  }

  /**
   * Clear project stage states cache from memory.
   * So you can return this states only from server or the localStorage
   *
   * @param projectId - project id
   */
  clearStagesState(projectId?: number) {
    for (const key of _.keys(this.stages)) {
      const stageState = this.stages[key];
      if (stageState.projectId === projectId) {
        delete this.stages[key];
      }
    }
    this.saveStagesState();
  }

  /**
   * Save temporary project stage states to localStorage
   */
  saveStagesState() {
    localStorage.setItem(
      'tempQuestionnaires', JSON.stringify(this.getStagesState())
    );
  }

  /**
   * Load temporary project stage states from the localStorage
   */
  loadStagesState() {
    const tempQuestionnaires = localStorage.getItem('tempQuestionnaires');
    const stagesState = this.getStagesState();
    if (tempQuestionnaires && _.isEmpty(stagesState)) {
      const stages = JSON.parse(tempQuestionnaires);
      for (const stage of _.keys(stages)) {
        this.stages[this.getKey(stage)] = stages[stage];
      }
    }
    this.loadStagesEvent.next(null);
  }
}
