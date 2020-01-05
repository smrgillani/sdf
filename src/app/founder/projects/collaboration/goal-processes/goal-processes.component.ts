import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as mammoth from 'mammoth';
import FormDataPolyfill from 'formdata-polyfill/formdata.min';

import TaskModel from 'app/core/models/TaskModel';
import {DocumentExplorerItem} from 'app/elements/document-explorer/DocumentExplorerItem';
import {FolderNavigation} from 'app/elements/document-explorer/FolderNavigation';
import {TasksService} from 'app/projects/tasks.service';
import {ProcessItem} from 'app/collaboration/document-explorer/ProcessItem';
import {GoalItem} from 'app/collaboration/document-explorer/GoalItem';

import DocumentModel from 'app/core/models/DocumentModel';
import { DocumentsService } from 'app/projects/documents.service';

@Component({
  template: `
    <app-document-explorer *ngIf="goal && !uploadDocument"
                           [is_goal]="true"
                           [items]="subtasks"
                           (open)="openProcess($event)"
                           (createDocument)="createDocument($event)"></app-document-explorer>

    <div class="row form-row drop_files" *ngIf="uploadDocument">
        <div class="col-12">
            <app-file-droppa #fileDroppa [dropZoneTemplate]="dropZoneDocumentTemplate" [url]="" [multiple]="false" [autoUpload]="false"
              [showFilesList]="false" (filesUpdated)="filesUpdated($event)" [openTriggerId]="'documentTrigger'" [beforeAddFile]="beforeAddFile">
              <p class="dropzone-help-text">Drop docx or xlsx file to the file area</p>
              <div class="profile-buttons">
                <div class="trigger" id="documentTrigger">
                  <!-- <span class="icon upload"></span>Upload <br> new file -->
                </div>
              </div>
            </app-file-droppa>
        </div>
        <div class="back-button" (click)="backToGoal()">Back</div>
      </div>
  `,
  styles: [`
  `]
})
export class CollaborationGoalProcessesComponent implements OnInit {
  goal: GoalItem;
  subtasks: DocumentExplorerItem[];
  // <app-spreadsheet [(ngModel)]="content"  (forceSave)="SaveUploadedDocument()"></app-spreadsheet>
  dropZoneDocumentTemplate: string;
  uploadDocument:boolean = false;
  document: DocumentModel;
  content = null;
  isSaveInProgress:boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private folderNavigation: FolderNavigation,
    private tasksService: TasksService,
    private documentsService: DocumentsService,
  ) {
    this.subtasks = [];
    this.dropZoneDocumentTemplate = `<div class="file-droppa-document-image file-droppa-passport"></div>`;
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const goalId = params['goalId'];
      this.tasksService.get(goalId).subscribe((goal: TaskModel) => {
        this.goal = new GoalItem(goal);
        this.folderNavigation.opened.emit(this.goal);
        this.subtasks = [];
        for (const subtaskId of goal.subtasks) {
          this.tasksService.get(subtaskId).subscribe((subtask: TaskModel) => {
            this.subtasks.push(new ProcessItem(subtask));
          });
        }
      });
    });
  }

  createDocument(type: string) {
    if(type==='upload')
    {
      this.uploadDocument = true;
      this.isSaveInProgress = false;
      return;
    }
    //below code is not going to be used in current scenario
    //In goal, only creator can upload the document which will be reflected in respective processes
    this.router.navigate([{
      outlets: {
        // documents: ['document', 'new', {type: type}]
        documents: ['document', type=='upload'?'upload':'new', {type: type, process: this.goal.resource.id}]
      }
    }], {relativeTo: this.route.parent});
  }

  backToGoal(){
    this.uploadDocument = false;
  }

  openProcess(processItem: ProcessItem) {
    this.router.navigate([{
      outlets: {
        documents: ['process', processItem.resource.id],
        chat: ['chat', processItem.resource.id]
      }
    }], {relativeTo: this.route.parent});
  }

  beforeAddFile(file:File){
    if(file.type.includes('spreadsheetml') || file.type.includes('wordprocessingml')){
      return true;
    }
    alert('Please upload docx or xlsx only');
    return false;
  }

  filesUpdated(files) {
    const file: File = files.reverse()[0];
    const fileReader: FileReader = new FileReader();
    const self = this;
    let fileType = file.name.substring(file.name.lastIndexOf('.') + 1);
    let fileName = file.name.substring(0,file.name.lastIndexOf('.'));
    let doc_type = 'document';
    if(fileType === 'xlsx' || fileType === 'xls')
    {
      doc_type = 'spreadsheet';
    }
    fileReader.readAsArrayBuffer(file);
    this.document = {
      id: null,
      name: fileName,
      doc_type: doc_type,
      task: this.goal.resource.id,
      percentage:0,
    } as DocumentModel;

    fileReader.onloadend = (event: ProgressEvent) => {
      if(fileType==='xlsx' || fileType === 'xls')
      {
        if (event.target['result']) {
          self.content = event.target['result'];
          self.document['ext'] = 'xlsx';
          self.SaveUploadedDocument();
        }
      }
      else{
        mammoth['convertToHtml']({ arrayBuffer: event.target['result'] })
        .then((result) => {
          self.content = result.value;
          self.document['ext'] = 'html';
          self.SaveUploadedDocument();
        })
        .catch((error) => {
          console.log(error);
        });
      }
    };
  }

  SaveUploadedDocument() {
    if(this.isSaveInProgress)
    {
      return;
    }
    const formData = this.getFormData();
    this.isSaveInProgress = true;
    this.documentsService.uploadDocumentFromGoal(formData)
      .subscribe((document: DocumentModel) => {
        this.document = document;
        this.uploadDocument = false;
        this.isSaveInProgress = false;
      }, (error) => {
        this.isSaveInProgress = false;
      });
  }

  getFormData(): FormDataPolyfill {
    let file: File;
    let content = this.content;

    if (this.document.doc_type === 'document') {
      this.document['ext'] = 'html';
    }
    else if (this.document.doc_type === 'spreadsheet') {
      console.log(this.content);
      // const arrayBuffer = this.base64ToArrayBuffer(this.content);
      const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      content = new Blob([this.content], { type: fileType });
      this.document['ext'] = 'xlsx';
    }

    file = new File([content], `${this.document.name}.${this.document['ext']}`);
    this.document['document'] = file;

    const formData = new FormDataPolyfill();

    for (const key in this.document) {
      if (this.document[key]) {
        formData.append(key, this.document[key]);
      }
    }

    return formData;
  }

  base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
