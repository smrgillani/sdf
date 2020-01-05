import {
    Component,
    EventEmitter,
    Input, OnDestroy,
    OnInit,
    Output,
  } from '@angular/core';
import { Subscription } from 'rxjs';
import {Ng2DeviceService} from 'ng2-device-detector';
import * as _ from 'lodash';

import RegistrationAnswerValidator from "app/founder/projects/register/questionnaire/qa/AnswerValidator";
import RegistrationStageState from 'app/founder/projects/register/questionnaire/RegistrationStageState';
import RegistrationQuestion from 'app/founder/projects/register/questionnaire/models/RegistrationQuestion';
import { RegistrationQuestionnaireService } from 'app/founder/projects/register/questionnaire/RegistrationQuestionnaireService';
import { RegistrationStageStorage } from 'app/founder/projects/register/questionnaire/RegistrationStageStorage';
import RegistrationAnswer from 'app/founder/projects/register/questionnaire/models/RegistrationAnswer';


@Component({
    selector:'app-registration-qa',
    templateUrl:'./qa.component.html',
    styleUrls:[
        './qa.component.scss',
        './qa.component.portrait.css'
    ],
    providers:[
        RegistrationAnswerValidator
    ],
})
export class RegistrationQAComponent implements OnInit, OnDestroy{
    @Input() stageState:RegistrationStageState;
    @Input() projectId:number;
    @Input() entityType:number;
    @Output() done = new EventEmitter<boolean>();
    // @Output() next = new EventEmitter<RegistrationQuestion>();

    private editingIndex = -1;
    private qa: RegistrationQuestion[];
    private preventScrollFlag = false;
    private reachedStep = 0;
    private isSubmitting = false;
    private loadStagesSubscription: Subscription;
    private processing = false;

    constructor(
        private questionnaireService: RegistrationQuestionnaireService,
        private answerValidator: RegistrationAnswerValidator,
        private deviceService: Ng2DeviceService,
        private stageStorage: RegistrationStageStorage
    ){
        this.qa = [];
    }

    ngOnInit(){
        // this.loadQAs();
        this.loadStagesSubscription = this.stageStorage.loadStagesEvent.subscribe(() => {
          this.loadQAs();
        });
    }
    ngOnDestroy(){
        this.loadStagesSubscription.unsubscribe();
    }

    loadQAs() {
        this.editingIndex = 0;
        this.questionnaireService.getQuestions(this.entityType)
          .subscribe(
            (questions: RegistrationQuestion[]) => {
              questions = _.filter(
                questions, (question) => question['group'] === this.stageState.stage
              );

              questions.forEach((question) => question['answer'] = new RegistrationAnswer());

              for (const answer of this.stageState.answers) {
                const question = _.find(questions, (q) => q.id === answer.question);
                if (question) {
                  question['answer'] = answer;
                }
              }

              this.qa = _.orderBy(questions, ['order']);
              let i = this.qa.findIndex(f => f.id === this.stageState.nextQuestion);
              // console.log(`find index = ${i}`);
              if (i > 0) {
                this.setNext(i);
              }
            },
            (errorMsg: any) => {
              console.log(errorMsg);
            }
          );
    }

    saveQA(question: any) {
        console.log('save qa', question);
    }

    trackByIndex(index: number, obj: any): any {
        return index;
    }

    setNext(index: number) {
      if (index < this.qa.length) {
        this.editingIndex = index;
      }

      if (this.reachedStep < this.editingIndex) {
        this.reachedStep = this.editingIndex;
      }

      this.setBlur(index - 1);
      if (this.editingIndex >= this.qa.length) {
        this.stageState.done = true;
        this.scrollBottom();
      } else {
        this.stageState.done = false;
        this.scrollTo(this.editingIndex);
      }
  }

    onNext(index: number) {
        if (index < this.qa.length) {
          this.editingIndex = index + 1;
        }

        if (this.reachedStep < this.editingIndex) {
          this.reachedStep = this.editingIndex;
        }

        const question = this.qa[index];
        this.rememberAnswer(question);

        let currentAnswer:RegistrationAnswer[] = [];
        currentAnswer.push(question.answer);
        this.questionnaireService
        .saveAnswers(currentAnswer, this.stageState.projectId)
        .subscribe();


        this.setBlur(index);
        if (this.editingIndex >= this.qa.length) {
          this.stageState.done = true;
          //this.next.emit(null);
          this.scrollBottom();
        } else {
          //this.next.emit(this.qa[this.editingIndex]);
          this.stageState.done = false;
          this.scrollTo(this.editingIndex);
        }
    }

    onPrev(index: number) {
        if (index !== 0) {
          this.editingIndex = index - 1;

          this.setBlur(index);
          this.stageState.done = false;
          this.scrollTo(this.editingIndex);
        }
    }

    setFocus(index: number) {
        const device = this.deviceService.getDeviceInfo();

        if (device === 'android' || device === 'iphone') {
          return;
        }
        const id = 'input-' + this.qa[index].id;
        const element = document.getElementById(id);
        if (element) {
          element.focus();
        }
    }

    setBlur(index: number) {
        const id = 'input-' + this.qa[index].id;
        const element = document.getElementById(id);
        if (element) {
          element.blur();
        }
    }

    scrollTo(index: number) {
        const id = 'card-container-' + index;
        const element = document.getElementById(id);
        if (element) {
          this.preventScrollFlag = true;
          setTimeout(() => {
            this.preventScrollFlag = false;
            this.setFocus(this.editingIndex);
          }, 500);
          element.scrollIntoView(true);
        }
    }

    scrollBottom() {
        setTimeout(() => {
          const element = document.getElementById('done');
          if (element) {
            this.preventScrollFlag = true;
            element.scrollIntoView(true);
          }
        }, 500);
    }

    onScroll(event: any) {
        if (this.preventScrollFlag) {
          return;
        }

        for (let i = 0; i <= this.reachedStep; i++) {
          const id = 'card-' + i;
          const element = document.getElementById(id);
          if (element && i !== this.editingIndex) {
            const rect = element.getBoundingClientRect();
            if (rect.top > 200 && rect.top < 400) {
              this.editingIndex = i;
              this.setBlur(this.editingIndex);

              this.stageState.done = false;
              return;
            }
          }
        }

        if (this.reachedStep === this.qa.length) {
          const element = document.getElementById('divDone');
          const rect = element.getBoundingClientRect();
          if (rect.top < 500) {
            this.setBlur(this.editingIndex);
            this.editingIndex = this.qa.length;
            this.stageState.done = true;
          }
        }
    }

    changeAnswers() {
        this.editingIndex = 0;
        this.stageState.done = false;
    }

    onSubmit() {
      if (this.isSubmitting) {
        return;
      }
      if (this.stageState.projectId) {
        this.isSubmitting = true;
        this.processing=true;
        this.questionnaireService
          .saveAnswers(this.stageState.answers, this.stageState.projectId)
          .subscribe(
            () => {
              this.isSubmitting = false;
              this.processing=false;
              this.done.emit(true);
            },
            () => {
              this.isSubmitting = false;
              this.processing=false;
            });
      } else {
        for (const question of this.qa) {
          this.rememberAnswer(question);
        }
        this.done.emit(true);
      }
    }

    onForceSave() {
        if (this.stageState.projectId) {
          for (const question of this.qa) {
            this.rememberAnswer(question);
          }

          this.questionnaireService
            .saveAnswers(this.stageState.answers, this.stageState.projectId)
            .subscribe();
        }
    }

    protected rememberAnswer(question) {
        const answer = _.find(this.stageState.answers, (a) => a.question === question.id);
        if (!answer) {
          const questionAnswer = question.answer;
          questionAnswer['question'] = question.id;

          this.stageState.answers.push(questionAnswer);
        }
        if (!this.stageState.projectId) {
          this.stageStorage.saveStagesState();
        }
    }
}
