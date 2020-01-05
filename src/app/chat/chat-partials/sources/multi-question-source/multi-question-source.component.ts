import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef, AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'app-multi-question-source',
  templateUrl: './multi-question-source.component.html',
  styleUrls: ['./multi-question-source.component.scss'],
})
export class MultiQuestionSourceComponent implements OnInit, OnChanges, AfterViewInit {
  answers: string[];

  @Input() questions: string[];
  @Input() private message = '';

  @Output() private forceSave = new EventEmitter<string>();
  @Output() private typingStarted = new EventEmitter<void>();
  @Output() private typingEnded = new EventEmitter<void>();

  @ViewChildren('questions_elements') private questionsElements: QueryList<ElementRef>;

  private get allAnswersFilled() {
    return this.answers.indexOf('') === -1;
  }

  ngOnInit() {
    this.clearAnswers();

    if (this.message) {
      this.setAnswers(this.message);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.message && !changes.message.isFirstChange()) {
      this.setAnswers(changes.message.currentValue);
    }
  }

  ngAfterViewInit(): void {
    this.questionsElements.first.nativeElement.children[1].children[0].focus();
  }

  emitForceSave() {
    if (this.allAnswersFilled) {
      let data = '';

      this.answers.forEach((answer, index) => {
        data += `<strong>${this.questions[index]}</strong> \n${answer}`;

        if (index < this.answers.length - 1) {
          data += '\n <br>';
        }
      });

      this.forceSave.emit(data);
    } else {
      this.forceSave.emit('');
    }
  }

  onTextInputKeyDown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      this.emitForceSave();
      this.typingEnded.emit();
    } else {
      this.typingStarted.emit();
    }
  }

  onTextInputKeyUp() {
    this.emitForceSave();
    this.typingEnded.emit();
  }

  private clearAnswers() {
    if (this.answers === undefined) {
      this.answers = new Array(this.questions.length);
    }

    this.answers.fill('');
  }

  private setAnswers(message: string) {
    let questionIndex, nextQuestionIndex;

    this.questions.forEach((question, index) => {
      questionIndex = questionIndex === undefined ? 0 : message.indexOf(`<strong>${question}</strong> \n`);
      nextQuestionIndex = index < this.questions.length - 1 ? message.indexOf(`\n <br><strong>${this.questions[index + 1]}</strong> \n`) : undefined;

      this.answers[index] = message.substring(questionIndex, nextQuestionIndex).replace(`<strong>${question}</strong> \n`, '');
      });
  }
}
