import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotarizeDocument } from '../../projects/models/project-notarization-model';
import { DocumentsService } from '../../projects/documents.service';
import { WebSocketService } from 'app/common/services/webSocket.service';
import { JwtHelper } from 'angular2-jwt';
import Delta from 'quill-delta';

@Component({
  selector: 'app-ocr-input',
  templateUrl: './ocr-input.component.html',
  styleUrls: ['./ocr-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OcrInputComponent),
      multi: true,
    }, DocumentsService],
})
export class OcrInputComponent implements OnInit, ControlValueAccessor, AfterViewInit {
  content: any;
  fileDetail: NotarizeDocument;
  ocrError = '';
  isHandwriting = false;
  popUpForShowInterestModalRef: NgbModalRef;
  ocrTextChanging = true;
  editorOpened = true;
  private fileName: string;
  private wsURLPath = `/task-document/`;
  private jwtHelper: JwtHelper = new JwtHelper();
  private userID: number;

  // dropZoneFileTemplate: string;
  // returnContentId: string;
  // flagSave: boolean = false;
  // flagFile = false;

  @Input() isCollab = false;
  @Input() readOnly = false;
  @Input() viewOnly = false;
  @Input() documentid: number;
  @Input() docInfo: any;
  @Input() private isWorkArea = true;

  // @ViewChild('returnContentId') private returnContentId: ElementRef;
  @ViewChild('popUpForShowInterestMessage') private popUpForShowInterestMessage;
  @ViewChild('popUpForFileTypeMessage') private popUpForFileTypeMessage: ElementRef;

  /**
   * Emitter that trigger after some generated data event interaction
   * @param forceSave
   */
  @Output() private forceSave = new EventEmitter();

  constructor(
    private documentsService: DocumentsService,
    private modalService: NgbModal,
    private ws: WebSocketService,
  ) {
    // this.dropZoneFileTemplate = `<div class="file-droppa-document-image file-droppa-passport"></div>`;
    this.fileDetail = new NotarizeDocument();
  }

  ngOnInit() {
    const jwt = localStorage.getItem('token');
    const jwtDetails = this.jwtHelper.decodeToken(jwt);
    this.userID = jwtDetails.user_id;
  }

  ngAfterViewInit() {
    if (this.content) {
      // this.returnContentId.nativeElement.innerHTML = !this.isWorkArea ? this.content.content : this.content;
      this.fileName = !this.isWorkArea ? this.content.fileName : '';
    }

    this.isHandwriting = false;
  }

  /**
   * Callback called after new photo was chosen
   */
  imageChangeListener($event) {
    this.fileDetail.document = $event.src;

    if (this.isCollab && this.documentid && this.content) {
      this.ocrTextChanging = true;
      const currentDelta = new Delta().insert(this.content.content.replace(/(\r\n|\n|\r)/gm, ''));
      const emptyDelta = new Delta().insert('');
      const diff = currentDelta.diff(emptyDelta);
      const emitData = {
        command: 'ocr_image_change',
        message: {'user': this.userID, 'src': $event.src, 'delta': JSON.stringify(diff)},
      };

      this.ws.connect(`${this.wsURLPath}${this.documentid}`).next(JSON.stringify(emitData));
      this.content.content = '';
    }

    this.updateFile();
  }

  openEditor() {
    this.editorOpened = true;
  }

  closeEditor() {
    this.editorOpened = false;
  }

  onRemoteImageChange(src) {
    this.fileDetail.document = src;
    this.content.content = '';
  }

  onOcrTextWritten() {
    this.ocrTextChanging = false;
  }

  onForceSave() {
    this.saveChanges();
  }

  writeValue(currentValue: any) {
    if (currentValue) {
      this.content = currentValue ? currentValue : '';
      this.fileName = currentValue ? !this.isWorkArea ? currentValue.fileName : '' : '';
      // this.returnContentId.nativeElement.innerHTML = currentValue ? !this.isWorkArea ? currentValue.content : currentValue.content : '';

      if (currentValue && currentValue.content) {
        this.content.content = !this.isWorkArea ? currentValue.content.toString() : currentValue.content;
      } else {
        this.content.content = '';
      }

      // this.fileDetail.document = currentValue ? this.isWorkArea && currentValue.ocr_image ? currentValue.ocr_image :
      // !this.isWorkArea && currentValue.ocr_image ? currentValue.ocr_image : '': '';
      this.fileDetail.document = currentValue ? currentValue.ocr_image : '';
      this.isHandwriting = false;
    }
  }

  selectToFileType(event) {
    if (event.target.checked && this.content) {
      this.updateContent();
    }
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private onChange = (_) => {};
  private onTouched = () => {};

  private saveGeneratedFile(obj) {
    this.content = obj;
    this.onChange(this.content);
    this.forceSave.emit();
  }

  private updateFile() {
    this.ocrError = '';

    if (this.fileDetail.document && this.fileDetail.document !== '') {
      this.documentsService.createOCRDocument(this.fileDetail.document, this.isHandwriting, this.isWorkArea).subscribe(
        (obj) => {
          // this.returnContentId.nativeElement.innerHTML = obj.content;
          if (this.isCollab && this.documentid) {
            this.ocrTextChanging = true;
            obj.content = obj.content.trim();
            this.content = obj;
            const insertText = this.content.content.replace(/(\r\n|\n|\r)/gm, '');
            const delta = new Delta().insert(insertText);
            const emitData = {
              command: 'edit',
              message: {
                'user': this.userID,
                'delta': JSON.stringify(delta),
              },
            };

            this.ws.connect(`${this.wsURLPath}${this.documentid}`).next(JSON.stringify(emitData));
          }
          this.fileName = !this.isWorkArea ? obj.fileName : '';
          // this.flagSave = true;
          this.saveGeneratedFile(obj);

          this.openEditor();
        },
        (err: any) => {
          this.ocrError = err.message;
        });
    } else {
      if (this.content && (this.content.content || this.content.content === '')) {
        this.updateContent();
      }
    }
  }

  private saveChanges() {
    this.onChange(this.content);
    this.forceSave.emit();
  }

  private updateContent() {
    // this.returnContentId.nativeElement.innerHTML = this.content.content = '';
    this.fileDetail.document = undefined;
    this.content.ocr_image = null;
    this.onChange(this.content);
    this.forceSave.emit();
  }

  // edithContent() {
  //   this.readOnly = !this.readOnly;
  // }
}
