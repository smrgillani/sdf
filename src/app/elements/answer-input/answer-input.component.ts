import {
  AfterViewInit,
  Component,
  ViewChild,
  EventEmitter,
  HostListener,
  Input,
  Output, ChangeDetectorRef, AfterViewChecked,
} from '@angular/core';
import * as moment from 'moment';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

import AnswerValidator from 'app/questionnaire/qa/AnswerValidator';
import Question from 'app/questionnaire/models/Question';

import { vdCanvasService } from '../vd-canvas/vd-canvas.service';
import { VdCanvasOptions } from '../vd-canvas/vd-canvas.component';


/**
 * Input switcher for different answer types.
 *
 * @input question - question object
 * @input autoFocus - flag, indicate that element catch a focus
 * @input saveAnswer - flag, indicate that answer should be saved
 * @output forceSave - force saving of data
 * @output onBlur - event, triggers on editing ends
 * @output onNext - event, triggers on jump to next question
 */
@Component({
  selector: 'app-answer-input',
  templateUrl: './answer-input.component.html',
  styleUrls: ['./answer-input.component.scss'],
  viewProviders: [vdCanvasService],
})
export class AnswerInputComponent implements AfterViewInit, AfterViewChecked {
  date: Date = new Date();
  dropZoneFileTemplate = `<div class="file-droppa-document-image file-droppa-passport"></div>`;
  private radioIndexAlpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

  canvasOptions: VdCanvasOptions = {
    drawButtonEnabled: true,
    drawButtonClass: 'drawButtonClass',
    drawButtonText: 'Draw',
    clearButtonEnabled: true,
    clearButtonClass: 'clearButtonClass',
    clearButtonText: 'Clear',
    undoButtonText: 'Undo',
    undoButtonEnabled: true,
    redoButtonText: 'Redo',
    redoButtonEnabled: true,
    colorPickerEnabled: true,
    saveDataButtonEnabled: false,
    saveDataButtonText: 'Save',
    strokeColor: 'rgb(0,0,0)',
    shouldDownloadDrawing: false,
    canvasCurser: 'auto',
  };

  @ViewChild('takePhotoPopover1') private takePhotoPopover1: NgbPopover;
  @ViewChild('vdCanvas') private vdCanvas: vdCanvasService;

  @Input() isSummary = false;
  @Input() question: Question;
  @Input() isViewOnly = false;
  @Input() private autoFocus = true;
  @Input() private saveAnswer = false;
  @Output() onBlur = new EventEmitter();
  @Output() private forceSave = new EventEmitter();
  @Output() private onNext = new EventEmitter();

  constructor(
    private answerValidator: AnswerValidator,
    private cdRef: ChangeDetectorRef,
  ) {
  }

  ngAfterViewInit() {
    if (this.autoFocus) {
      const input = document.getElementById(`input-${this.question.pk}`);
      if (input) {
        input.focus();
      }
    }

    setTimeout(() => {
      const alltextarea = document.getElementsByTagName('textarea');
      for (let i = 0; i < alltextarea.length; i++) {
        alltextarea[i].style.height = '0px';
        alltextarea[i].style.height = alltextarea[i].scrollHeight + 'px';

      }
    }, 0);

    // Update drop image template
    if (this.question.question_type === 'image') {
      if (this.question.answer.image) {

      } else {
        this.question.answer['image'] = null;
      }
    } else if (this.question.question_type === 'ppt') {
      if (this.question.answer.powerpoint) {
        this.updateFileTemplate();
      } else {
        this.question.answer['powerpoint'] = null;
      }
    } else if (this.question.question_type === 'doc_drawing') {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 1);
    } else if (this.question.question_type === 'radio' && this.question.answer.radio === undefined) {
      this.question.answer.radio = null;
    } else if (this.question.question_type === 'boolean' && this.question.answer.boolean_text === undefined) {
      this.question.answer.boolean_text = null;
    } else if (this.question.question_type === 'date' && this.question.answer.date !== undefined) {
      this.date = new Date(this.question.answer.date);
    }
    // else if(this.question.question_type === 'productcomp' && this.question.answer.answer_type === undefined){
    //   this.question.answer.answer_type = 'product';
    // }

    // This is a workarorund to get/set the saved values
    if (this.question.question_type === 'checkbox' || this.question.question_type === 'multiselect') {
      this.question.vals.forEach(element => {
        const opt = this.question.answer.multilist.find(a => a === element.id.toString());

        element.checked = !!opt;
      });
    }

    // // This is a workarorund to get the selected radio field
    // if(this.question.question_type === 'radio' && this.question.answer.selected_radio){
    //     this.question.answer.radio = this.question.answer.selected_radio;
    // }else if(this.question.question_type === 'checkbox' || this.question.question_type === 'multiselect'){

    // }
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: any) {
    if (this.question.question_type === 'text') {
      /* Client dont' want to move on next question on Enter */
      // if (event.code === 'Enter' && event.shiftKey === false) {
      //   const id = 'input-' + this.question.pk;
      //   const element = document.getElementById(id);
      //   if (element && id === event.target.id) {
      //     if (this.answerValidator.isValid(this.question)) {
      //       this.onNext.emit();
      //     } else { }
      //   }
      // }
    } else if (this.question.question_type === 'list') {
      if (event.code === 'Enter') {
        if (this.answerValidator.isValid(this.question)) {
          this.onNext.emit();
        } else {

        }
      } else {
        const radioIndex = this.radioIndexAlpha.indexOf(event.key.toUpperCase());
        if (radioIndex >= 0 && radioIndex < this.question.vals.length) {
          // this.question.answer = this.question.values[radioIndex];
        }
      }
    }

    if (event.ctrlKey === true && event.key.toUpperCase() === 'P') {
      this.question.answer.is_private = !(this.question.answer.is_private === true);
    }
  }

  chooseCheckbox(value: any, on: boolean) {
    if (!this.question.answer.multilist) {
      // this.question.answer['answers'] = [];
      this.question.answer.multilist = [];
    }
    // const i = this.question.answer['answers'].indexOf(value.key, 0);
    const i = this.question.answer.multilist.indexOf(value.id, 0);

    if (on && i < 0) {
      // this.question.answer['answers'].push(value);
      this.question.answer.multilist.push(value.id);
    } else if (!on && i >= 0) {
      // this.question.answer['answers'].splice(i, 1);
      this.question.answer.multilist.splice(i, 1);
    }
  }

  getCardType() {
    if (!this.question.answer.multilist) {
      this.question.answer.multilist = []; // To set default for multilist, api service not allowing null for this
    }

    if (this.question.question_type === 'text') {
      // if (!isNaN(this.question.options)) {
      //   if (this.question.options.multiline === true) {
      //     return 'text-multiline';
      //   } else if (this.question.options.format === 'tel') {
      //     return 'text-tel';
      //   } else if (this.question.options.format === 'number') {
      //     return 'text-number';
      //   } else if (this.question.options.format === 'email') {
      //     return 'text-email';
      //   }
      // } else {
      return 'text';
      // }
    } else if (this.question.question_type === 'date') {
      return 'date';
    } else if (this.question.question_type === 'radio') {
      return 'radio';
    } else if (this.question.question_type === 'boolean') {
      return 'boolean';
    } else if (this.question.question_type === 'image') {
      return 'image';
    } else if (this.question.question_type === 'checkbox' || this.question.question_type === 'multiselect') {
      return 'checkbox';
    } else if (this.question.question_type === 'doc_drawing') {
      this.canvasOptions.imageUrl = this.question.answer.diagram;
      return 'doc_drawing';
    } else if (this.question.question_type === 'diagram') {
      return 'diagram';
    } else if (this.question.question_type === 'doc_spreadsheet') {
      return 'doc_spreadsheet';
    } else if (this.question.question_type === 'ppt') {
      return 'ppt';
    } else if (this.question.question_type === 'swot') {
      return 'swot';
    } else if (this.question.question_type === 'ocr') {
      return 'ocr';
    } else if (this.question.question_type === 'list') {
      this.question.answer.model = this.question.model;
      return 'list';
    } else if (this.question.question_type === 'productcomp') {
      return 'productcomp';
    } else if (this.question.question_type === 'companycomp') {
      return 'companycomp';
    }

    return 'unknown';
  }

  onDateChange(date: Date) {
    this.question.answer.date = moment(date).format('YYYY-MM-DD');
  }

  imageChangeListener($event) {
    this.question.answer.image = $event.src;
    if (this.saveAnswer) {
      this.onBlur.emit();
    }
  }

  filesUpdated(files) {
    if (!files || files.length === 0) {
      return;
    }

    const file: File = files.reverse()[0];
    const fileReader: FileReader = new FileReader();
    const self = this;

    fileReader.addEventListener('loadend', function (loadEvent: any) {
      self.question.answer.powerpoint = loadEvent.target.result;
      self.updateFileTemplate();

      if (self.saveAnswer) {
        self.onBlur.emit();
      }
    });

    fileReader.readAsDataURL(file);
  }

  removeFile() {
    if (this.question.answer.powerpoint) {
      this.question.answer.powerpoint = null;
      this.updateFileTemplate();
    }
  }

  onForceSave() {
    this.forceSave.emit();
  }

  changeHeight() {
    const input = document.getElementById(`input-${this.question.pk}`);
    if (input) {
      input.style.height = '0px';
      input.style.height = input.scrollHeight + 'px';
    }
  }

  updateHeight() {
    const el = document.getElementById('input-' + this.question.pk);
    const event = new KeyboardEvent('keyup', {
      key: 'ArrowRight',
    });
    if (el) {
      el.dispatchEvent(event);
    }
  }

  onCanvasSave(evt: string | Blob) {
    this.question.answer.diagram = evt.toString();
  }

  onSwotDataChange() {
    this.onBlur.emit();
  }

  onOcrDataChange() {
    this.onBlur.emit();
  }

  onProductChange() {
    this.onBlur.emit();
  }

  private updateFileTemplate() {
    if (!!this.question.answer.powerpoint) {
      this.dropZoneFileTemplate = `<div class="file-droppa-document-image file-droppa-passport">
        <a class='ppt' href='${this.question.answer.powerpoint}'><i class="fa fa-file-text-o" aria-hidden="true"></i></a>
          </div>`;
    } else {
      this.dropZoneFileTemplate = `<div class="file-droppa-document-image file-droppa-passport"></div>`;
    }
  }
}
