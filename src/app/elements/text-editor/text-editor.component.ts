import {
  AfterViewInit, OnInit, OnDestroy, OnChanges, Component, EventEmitter, forwardRef, Output, Input, SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { JwtHelper } from 'angular2-jwt';

import { CURSOR_COLORS } from 'app/collaboration/collaboration.constants';
import { WebSocketService } from 'app/common/services/webSocket.service';
import { Subscription } from 'rxjs/Subscription';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';

Quill.register('modules/cursors', QuillCursors);

/**
 * Text editor component for text editing
 * Based on quilljs https://quilljs.com/
 *
 * @output forceSave - event, triggers when something changed
 *
 * Usage:
 *
 *  <app-text-editor [(ngModel)]="content"
 *                   (forceSave)="onForceSave()"
 *  ></app-text-editor>
 **/
@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextEditorComponent),
    multi: true,
  }],
})
export class TextEditorComponent implements AfterViewInit, OnChanges, OnInit, OnDestroy, ControlValueAccessor {
  @Input() isCollab = false;
  @Input() docInfo: any;
  @Input() private readOnly = false;
  @Input() private documentid: number;
  @Input() private isOcr = false;
  @Input() private ocrTextChanging: boolean;
  @Output() private forceSave = new EventEmitter();
  @Output() private blur: EventEmitter<any> = new EventEmitter();
  @Output() private focus: EventEmitter<any> = new EventEmitter();
  @Output() private ocrTextWritten: EventEmitter<string> = new EventEmitter();
  @Output() private remoteOcrImageChange: EventEmitter<string> = new EventEmitter();

  editorId: string;
  changeLogOpened = false;
  changeViewerParticipants: any;
  private editor: any;
  private changeViewer: any;
  private cursors: any;
  private cursorColors: string[];
  private content: any;
  private wsSubscription: Subscription;
  private applyingChanges = false;
  private userID: number;
  private readonly wsURLPath = `/task-document/`;
  private readonly jwtHelper: JwtHelper = new JwtHelper();

  private toolbar = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{'header': 1}, {'header': 2}],               // custom button values
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
    [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
    [{'direction': 'rtl'}],                         // text direction

    [{'size': ['small', false, 'large']}],  // custom dropdown
    [{'header': [1, 2, 3, 4, 5, 6, false]}],

    [{'color': []}, {'background': []}],          // dropdown with defaults from theme
    [{'font': []}],
    [{'align': []}],

    ['clean'],                                         // remove formatting button

    ['link', 'image', 'video'],                         // link and image, video
  ];

  constructor(
    private ws: WebSocketService,
  ) {
    this.editorId = 'quill-editor-' + Math.floor(Math.random() * 100000);
  }

  ngOnInit() {
    if (this.isCollab) {
      const jwt = localStorage.getItem('token');
      const jwtDetails = this.jwtHelper.decodeToken(jwt);
      this.userID = jwtDetails.user_id;
      this.resetAvailableCursorColors();
    }
  }

  ngOnDestroy() {
    if (this.isCollab && this.documentid) {
      console.log('getting disconnected');
      this.ws.connect(`${this.wsURLPath}${this.documentid}`).next('$closecon$');
      if (this.wsSubscription) {
        this.wsSubscription.unsubscribe();
      }
    } else {
      this.forceSave.emit();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isCollab && changes.documentid && changes.documentid.currentValue !== changes.documentid.previousValue) {
      this.updateSocketConnection(changes.documentid.currentValue);

      if (this.editor) {
        this.editor.enable(!this.readOnly);
      }
    }
  }

  ngAfterViewInit(): void {
    this.editor = new Quill(`#${this.editorId}`, {
      modules: {
        toolbar: this.toolbar,
        cursors: true,
      },
      theme: 'snow',
    });

    this.editor.disable();
    this.cursors = this.editor.getModule('cursors');

    this.editor.on('text-change', (delta, oldDelta, source) => {
      this.content = this.editor.root.innerHTML;
      this.onModelChange(this.editor.root.innerHTML);

      if (this.isCollab && source === 'user' && this.documentid) {
        const cursorRange = this.editor.getSelection();
        const emitData = {
          command: 'edit',
          message: {'user': this.userID, 'delta': JSON.stringify(delta)},
        };

        this.ws.connect(`${this.wsURLPath}${this.documentid}`).next(JSON.stringify(emitData));
        this.updateCursorsLocalChange(delta['ops']);
        this.shareCursorPosition(cursorRange);
      }

      if (this.isCollab && this.ws.checkConnected()) {
        this.forceSave.emit();
      }
    });

    this.editor.on('selection-change', (range, oldRange, source: any) => {
      if (!range) {
        this.blur.emit(this.editor);
      } else {
        this.focus.emit(this.editor);
      }

      if (source === 'user' && this.documentid) {
        this.shareCursorPosition(range);
      }
    });

    if (this.content) {
      this.applyingChanges = true;
      this.editor.pasteHTML(this.content);
      this.applyingChanges = false;
    }


    if (this.isCollab) {
      this.changeViewer = new Quill(`#${this.editorId}-changes`, {
        modules: {
          toolbar: false,
        },
        theme: 'snow',
        readOnly: true,
      });
    } else {
      this.editor.enable(!this.readOnly);
    }
  }

  writeValue(currentValue: any) {
    if (this.isCollab && this.isOcr && !this.ocrTextChanging) {
      return;
    }
    this.content = currentValue;
    if (this.editor) {
      if (currentValue) {
        this.applyingChanges = true;
        this.editor.pasteHTML(currentValue);
        this.applyingChanges = false;
        this.editor.enable(!this.readOnly);
        if (this.isCollab && this.isOcr && this.ocrTextChanging === true) {
          this.ocrTextWritten.emit();
        }
        return;
      }
      this.editor.setText('');
      if (this.isCollab && !this.documentid) {
        this.forceSave.emit();
      } else if (this.isCollab && this.ws.checkConnected()) {
        this.editor.enable(!this.readOnly);
      }
    }
  }

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  openChangeLog() {
    const changes = this.docInfo.changes;
    const nondistinct_changer_list = changes.map(change => change.editing_user.user_id);
    const changers = Array.from(new Set(nondistinct_changer_list));

    // assign a color to each user who has made changes
    this.changeViewerParticipants = [];

    changers.forEach((changer: number) => {
      const availableColors = CURSOR_COLORS.slice(0);
      this._shuffle(availableColors);
      const userChange = changes.find(change => change.editing_user.user_id === changer);
      this.changeViewerParticipants.push({
        user: changer,
        name: userChange.editing_user.name,
        color: availableColors.pop(),
      });
    });

    this.showChanges();
    this.changeLogOpened = true;
  }

  closeChangeLog() {
    this.changeViewer.setContents([{insert: ''}]);
    this.changeLogOpened = false;
  }

  showChanges(timestamp?: string) {
    this.changeViewer.setContents([{insert: ''}]);

    // const changes = this.docInfo.changes;
    // let fromDate: Date = null;
    // let toDate: Date = null;

    // if (timestamp) {
    //   if (this.docInfo.session_endings && timestampToIndex + 1 < this.docInfo.session_endings.length) {
    //     fromDate = new Date(this.docInfo.session_endings[timestampToIndex + 1].timestamp_ended);
    //   } else {
    //     fromDate = new Date(changes[0].timestamp_changed);
    //   }
    //   toDate = new Date(this.docInfo.session_endings[timestampToIndex].timestamp_ended);
    // } else {
    //
    //   if (this.docInfo.session_endings && this.docInfo.session_endings.length) {
    //     fromDate = new Date(this.docInfo.session_endings[0].timestamp_ended);
    //   } else {
    //     fromDate = new Date(changes[0].timestamp_changed);
    //   }
    // }

    // apply users' changes
    this.docInfo.changes.forEach(change => {
      const delta = JSON.parse(change['delta']);
      // const changeDate = new Date(change.timestamp_changed);

      if (!timestamp || change.timestamp_changed <= timestamp) {
      // if (changeDate.getTime() >= fromDate.getTime()) {
        delta.ops.forEach(op => {
          if (op.hasOwnProperty('insert')) {
            if (!op.hasOwnProperty('attributes')) {
              op['attributes'] = {};
            }

            const matchingParticipant = this.changeViewerParticipants
              .find(userObj => userObj['user'] === change.editing_user.user_id);

            if (matchingParticipant) {
              op['attributes']['background'] = matchingParticipant.color;
            }
          }
        });
      // }

        this.changeViewer.updateContents(delta, 'api');
      }
    });
  }

  private updateSocketConnection(docId) {
    if (docId) {
      this.wsSubscription = this.ws.connect(`${this.wsURLPath}${docId}`).subscribe((msg) => {
        const content = JSON.parse(msg.data);
        const messageType = content['message_type'];
        const message = content['message'];

        if (messageType === 'document_edit') {
          this.applyingChanges = true;
          const user = message['user'];
          const dd = message['delta'];

          if (user !== this.userID) {
            const op = JSON.parse(dd);

            const delta = {
              ops: op['ops'],
            };
            this.editor.updateContents(delta, 'api');
          }
          this.applyingChanges = false;
          // this.editor.update();
        } else if (messageType === 'new_active_user' || messageType === 'active_user') {
          if (message['user'] !== this.userID) {
            let displayName: string;
            const cursorColor = this.assignCursorColor();

            if (message['first_name'] && message['last_name']) {
              displayName = `${message['first_name']} ${message['last_name']}`;
            } else {
              displayName = message['email'];
            }

            this.ws.updateActiveParticipants(message['user'], 'add');
            this.cursors.createCursor(message['user'], displayName, cursorColor);

            if (messageType === 'active_user') {
              this.cursors.moveCursor(message['user'], message['cursor']);
            }

            this.cursors.update();
          }
        } else if (messageType === 'inactive_user') {
          if (message['user'] !== this.userID) {
            this.cursors.removeCursor(message['user']);
            this.cursors.update();
            this.ws.updateActiveParticipants(message['user'], 'remove');
          }
        } else if (messageType === 'cursor_position') {
          if (message['user'] !== this.userID) {
            this.cursors.moveCursor(message['user'], message['range']);
            this.cursors.update();
          }
        } else if (messageType === 'ocr_image_change') {
          if (message['user'] !== this.userID) {
            this.remoteOcrImageChange.emit(message['src']);
            this.editor.setText('', 'api');
          }
        }
      });
    }
  }

  private updateCursorsLocalChange(quillDeltaOps) {
    let cursorList: any[];
    cursorList = this.cursors.cursors();

    let positionChange = 0;

    quillDeltaOps.forEach(op => {
      if (op.hasOwnProperty('delete')) {
        positionChange -= op['delete'];
      } else if (op.hasOwnProperty('insert')) {
        positionChange += op['insert']['length'];
      }
    });

    const currentRange = this.editor.getSelection();

    cursorList.forEach(cursor => {
      if (currentRange && currentRange['index']) {
        const currentUserCursorPos = currentRange['length'] ? currentRange['index'] + currentRange['length'] : currentRange['index'];
        if (cursor['range'] && currentUserCursorPos < cursor['range']['index']) {
          const newRange = {index: cursor['range']['index'] + positionChange, length: cursor['range']['length']};
          this.cursors.moveCursor(cursor['id'], newRange);
        }
      }
    });
  }

  private shareCursorPosition(range) {
    if (this.isCollab) {
      const emitData = {
        command: 'cursor',
        message: {user: this.userID, range: range},
      };

      this.ws.connect(`${this.wsURLPath}${this.documentid}`).next(JSON.stringify(emitData));
    }
  }

  private onModelChange: Function = () => {};
  private onModelTouched: Function = () => {};

  private resetAvailableCursorColors() {
    this.cursorColors = CURSOR_COLORS.slice(0);
    this._shuffle(this.cursorColors);
  }

  private assignCursorColor() {
    if (!this.cursorColors || this.cursorColors.length === 0) {
      this.resetAvailableCursorColors();
    }

    return this.cursorColors.pop();
  }

  private _shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}
