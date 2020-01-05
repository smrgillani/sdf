import {
  Component,
  EventEmitter,
  Input, OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Ng2DeviceService } from 'ng2-device-detector';
import * as _ from 'lodash';

import { QuestionnaireService } from 'app/questionnaire/questionnaire.service';
import AnswerValidator from './AnswerValidator';
import Question from 'app/questionnaire/models/Question';
import StageState from 'app/questionnaire/StageState';
import Answer from 'app/questionnaire/models/Answer';
import { StageStorage } from 'app/questionnaire/StageStorage';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-idea-qa',
  templateUrl: './qa.component.html',
  styleUrls: [
    './qa.component.scss',
    './qa.component.portrait.scss',
  ],
  providers: [
    AnswerValidator,
  ],
})
export class QAComponent implements OnInit, OnDestroy {
  editingIndex = -1;
  qa: Question[] = [];
  reachedStep = 0;
  isSubmitting = false;
  processing = false;
  private preventScrollFlag = false;
  private loadStagesSubscription: Subscription;

  @Input() stageState: StageState;
  @Input() private projectStage: 'idea' | 'startup';
  @Output() private done = new EventEmitter<boolean>();
  @Output() private next = new EventEmitter<Question>();
  @Output() private skip = new EventEmitter<void>();

  constructor(
    private questionnaireService: QuestionnaireService,
    private answerValidator: AnswerValidator,
    private deviceService: Ng2DeviceService,
    private stageStorage: StageStorage,
  ) {
  }

  ngOnInit() {
    this.loadStagesSubscription = this.stageStorage.loadStagesEvent.subscribe(() => {
      // console.log(`ng on init`);
      this.loadQAs();
    });
  }

  ngOnDestroy() {
    this.loadStagesSubscription.unsubscribe();
  }

  trackByIndex(index: number, obj: any): any {
    return index;
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

    if (this.stageState.projectId) {
      const currentAnswer: Answer[] = [];
      currentAnswer.push(question.answer);
      this.questionnaireService
        .saveAnswers(currentAnswer, this.stageState.projectId, this.projectStage)
        .subscribe();

      this.setBlur(index);

      if (this.editingIndex >= this.qa.length) {
        this.stageState.done = true;
        this.scrollBottom();
      } else {
        this.stageState.done = false;
        this.scrollTo(this.editingIndex);
      }
    } else {
      this.next.emit(null);
    }
  }

  onSkip(index: number) {
    const question = this.qa[index];
    this.rememberAnswer(question);

    this.skip.emit();
  }

  onPrev(index: number) {
    if (index !== 0) {
      this.editingIndex = index - 1;

      this.setBlur(index);
      this.stageState.done = false;
      this.scrollTo(this.editingIndex);
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
      this.processing = true;
      this.questionnaireService
        .saveAnswers(this.stageState.answers, this.stageState.projectId, this.projectStage)
        .subscribe(
          () => {
            this.isSubmitting = false;
            this.processing = false;
            this.done.emit(true);
          },
          () => {
            this.isSubmitting = false;
            this.processing = false;
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
        .saveAnswers(this.stageState.answers, this.stageState.projectId, this.projectStage)
        .subscribe();
    }
  }

  private loadQAs() {
    this.editingIndex = 0;
    this.questionnaireService.getQuestions(this.projectStage)
      .subscribe(
        (questions: Question[]) => {
          questions = _.filter(
            questions, (question) => question['group'] === this.stageState.stage,
          );

          questions.forEach((question) => question['answer'] = new Answer());

          for (const answer of this.stageState.answers) {
            const question = _.find(questions, (q) => q.pk === answer.question);
            if (question) {
              question['answer'] = answer;
            }
          }

          this.qa = _.orderBy(questions, ['order']);
          const i = this.qa.findIndex(f => f.pk === this.stageState.nextQuestion);
          // console.log(`find index = ${i}, next question = ${this.stageState.nextQuestion}`);
          if (i > 0) {
            this.setNext(i);
          }
          // this.qa.forEach((question, index) => {
          //   if (question.pk === this.stageState.nextQuestion && index > 0) {
          //     console.log(`for each index = ${index}`);
          //     this.setNext(index);
          //   }
          // });
        },
        (errorMsg: any) => {
          console.log(errorMsg);
        },
      );
  }

  private setNext(index: number) {
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

  private setFocus(index: number) {
    const device = this.deviceService.getDeviceInfo();

    if (device === 'android' || device === 'iphone') {
      return;
    }
    const id = 'input-' + this.qa[index].pk;
    const element = document.getElementById(id);
    if (element) {
      element.focus();
    }
  }

  private setBlur(index: number) {
    const id = 'input-' + this.qa[index].pk;
    const element = document.getElementById(id);
    if (element) {
      element.blur();
    }
  }

  private scrollTo(index: number) {
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

  private scrollBottom() {
    setTimeout(() => {
      const element = document.getElementById('done');
      if (element) {
        this.preventScrollFlag = true;
        element.scrollIntoView(true);
      }
    }, 500);
  }

  private rememberAnswer(question) {
    const answer = _.find(this.stageState.answers, (a) => a.question === question.pk);
    if (!answer) {
      const questionAnswer = question.answer;
      questionAnswer['question'] = question.pk;

      this.stageState.answers.push(questionAnswer);
    }
    if (!this.stageState.projectId) {
      this.stageStorage.saveStagesState();
    }
  }
}
