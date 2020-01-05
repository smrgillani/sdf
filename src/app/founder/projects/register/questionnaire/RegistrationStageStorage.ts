import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import * as _ from 'lodash';
import { Subject } from "rxjs";
import { BehaviorSubject } from 'rxjs';

import RegistrationStageState from "app/founder/projects/register/questionnaire/RegistrationStageState";
import { RegistrationQuestionnaireService } from "app/founder/projects/register/questionnaire/RegistrationQuestionnaireService";
import RegistrationQuestion from "app/founder/projects/register/questionnaire/models/RegistrationQuestion";
import RegistrationAnswer from "app/founder/projects/register/questionnaire/models/RegistrationAnswer";


/**
 * Service for saving project registration questionnaires state.
 */
@Injectable()
export class RegistrationStageStorage {
    loadStagesEvent: BehaviorSubject<any>;
    protected stages: _.Dictionary<RegistrationStageState> = {};

    constructor(private questionnaireService: RegistrationQuestionnaireService) {
        this.loadStagesEvent = new BehaviorSubject(null);
    }

    protected getKey(stage: string, projectId: number): string {
        return `${projectId}-${stage}`;
    }

    /**
    * Get status and answers of a project stage.
    * If there no object this method create it.
    *
    * @param stage - questionnaire stage, for example 'express', 'develop' etc
    * @param projectId - project id
    * @returns state object
    */
    getStageState(stage: string, projectId: number): RegistrationStageState {
        const key = this.getKey(stage, projectId);
        let stageState = this.stages[key];
        if (!stageState) {
            stageState = new RegistrationStageState();
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
    getStagesState(projectId?: number): _.Dictionary<RegistrationStageState> {
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
    loadAnswers(projectId: number, entityType: number): Observable<RegistrationStageState> {
        return Observable.create((observer) => {
            this.questionnaireService.getQuestions(entityType)
                .subscribe((questions: RegistrationQuestion[]) => {
                    this.questionnaireService.getProjectAnswers(projectId, 'registration')
                        .subscribe((answers: RegistrationAnswer[]) => {
                            const groups = _.groupBy(questions, 'group');

                            for (const group of _.keys(groups)) {
                                const stageState = this.getStageState(group, projectId);
                                // const groupQuestions = groups[group];
                                const groupQuestions = _.orderBy(groups[group], ['order']);
                                stageState.answers = [];
                                groupQuestions.forEach((q) => {
                                    if (answers.find(a => a.question == q.id)) {
                                        stageState.answers.push(answers.find(a => a.question == q.id));
                                    }
                                });
                                // stageState.answers = answers.filter(
                                //     (a) => _.find(groupQuestions, { id: a.question })
                                // );
                                const lastAnswer = _.last(stageState.answers);
                                if (lastAnswer) {
                                    const lastIndex = _.findIndex(groupQuestions, (q) => q.id === lastAnswer.question);
                                    if (lastIndex + 1 < groupQuestions.length) {
                                        stageState.nextQuestion = groupQuestions[lastIndex + 1].id;
                                    }
                                }
                                stageState.done = stageState.answers.length === groupQuestions.length;
                                observer.next(stageState);
                            }
                            this.loadStagesEvent.next(null);
                            observer.complete();
                        });
                });
        });
    }

    /**
     * Clear new project temporary states from the localStorage.
     */
    clear() {
        this.stages = {};
        localStorage.removeItem('tempRegistrationQuestionnaires');
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
            'tempRegistrationQuestionnaires', JSON.stringify(this.getStagesState())
        );
    }

    /**
     * Load temporary project stage states from the localStorage
     */
    loadStagesState(projectId: number) {
        const tempRegistrationQuestionnaires = localStorage.getItem('tempRegistrationQuestionnaires');
        const stagesState = this.getStagesState();
        if (tempRegistrationQuestionnaires && _.isEmpty(stagesState)) {
            const stages = JSON.parse(tempRegistrationQuestionnaires);
            for (const stage of _.keys(stages)) {
                this.stages[this.getKey(stage, projectId)] = stages[stage];
            }
        }
        this.loadStagesEvent.next(null);
    }
}