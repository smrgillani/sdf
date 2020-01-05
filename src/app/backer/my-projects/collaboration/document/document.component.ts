import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import FormDataPolyfill from 'formdata-polyfill/formdata.min';
import * as mammoth from 'mammoth';

import DocumentModel from 'app/core/models/DocumentModel';
import { FolderNavigation } from 'app/elements/document-explorer/FolderNavigation';
import { DocumentsService } from 'app/projects/documents.service';
import { TasksService } from 'app/projects/tasks.service';

import { DocumentItem } from '../document-explorer/DocumentItem';
import { ProcessItem } from 'app/collaboration/document-explorer/ProcessItem';
import { vdCanvasService } from 'app/elements/vd-canvas/vd-canvas.service';
import { VdCanvasOptions } from 'app/elements/vd-canvas/vd-canvas.component';
import * as moment from 'moment';


@Component({
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  viewProviders: [vdCanvasService],
})
export class CollaborationDocumentComponent implements OnInit {
  documentItem: DocumentItem;
  document: DocumentModel;
  lastSaved = null;
  content = null;
  loadData = false;

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

  private isSaving: boolean;
  @ViewChild('vdCanvas') private vdCanvas: vdCanvasService;

  constructor(
    private route: ActivatedRoute,
    private documentsService: DocumentsService,
    private tasksService: TasksService,
    private folderNavigation: FolderNavigation,
  ) {
    this.document = new DocumentModel();
    this.documentItem = null;
    this.isSaving = false;
  }

  get lastSavedRelative() {
    return moment(this.lastSaved).fromNow();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const documentId = params['documentId'];

      if (documentId === 'new') {
        this.document = {
          id: null,
          name: 'New Document',
          doc_type: params['type'],
          task: params['process'],
        } as DocumentModel;
        this.documentItem = new DocumentItem(this.document);
        this.tasksService.get(this.document.task).subscribe((task) => {
          this.documentItem.parent = new ProcessItem(task);
          this.folderNavigation.addItem(this.documentItem);
          this.folderNavigation.opened.emit(this.documentItem);
        });
        this.loadData = true;
      } else {
        this.getDocument(documentId);
      }
    });
  }

  onForceSave() {
    // if (this.document.id) {
    //   this.updateDocument();
    // } else {
    //   this.createDocument();
    // }
  }

  private getDocument(id: number) {
    this.documentsService.get(id).flatMap((document: DocumentModel) => {
      this.document = document;
      const self = this;

      if (this.document['doc_type'] === 'ocr') {
        this.parseDocumentForOCR(this.document);
      } else if (this.document['doc_type'] === 'drawing') {
        this.documentsService.getDrawing(this.document['document'])
          .subscribe((response: any) => {
            self.canvasOptions.imageUrl = response._body;
            self.loadData = true;
          }, (error) => {
            self.loadData = true;
            console.log(error);
          });
      } else {
        this.documentsService.getDocument(this.document['document'])
          .subscribe((blob: Blob) => {
            this.parseDocument(blob);
          });
      }

      this.documentItem = new DocumentItem(document);
      return this.tasksService.get(document.task);
    }).subscribe((task) => {
      this.documentItem.parent = new ProcessItem(task);
      this.folderNavigation.addItem(this.documentItem);
      this.folderNavigation.opened.emit(this.documentItem);
    });
  }

  private parseDocument(blob: Blob) {
    const fileReader = new FileReader();

    if (this.document['ext'] === 'docx') {
      fileReader.readAsArrayBuffer(blob);

      fileReader.onloadend = (event: ProgressEvent) => {
        mammoth['convertToHtml']({arrayBuffer: event.target['result']})
          .then((result) => {
            this.content = result.value;
            this.document['ext'] = 'html';
          })
          .catch((error) => {
            console.log(error);
          });
      };
    } else if (this.document['ext'] === 'xlsx') {
      fileReader.readAsArrayBuffer(blob);

      fileReader.onloadend = (event: ProgressEvent) => {
        if (event.target['result']) {
          this.content = event.target['result'];
        }
      };
    } else {
      fileReader.readAsText(blob);

      fileReader.onloadend = (event: ProgressEvent) => {
        this.content = event.target['result'];
      };
    }
  }

  private parseDocumentForOCR(document: DocumentModel) {
    const setData: OcrData = new OcrData();
    const self = this;

    self.documentsService.getDocument(document['document'])
      .subscribe((blob: Blob) => {
        const fileReader1 = new FileReader();
        fileReader1.readAsText(blob);

        fileReader1.onloadend = (event: ProgressEvent) => {
          setData.content = event.target['result'];
          setData.ocr_image = document['ocr_image'];
          self.content = setData;
        };
      });
  }

  private base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private getFormData(): FormDataPolyfill {
    let file: File;
    let content = this.content;

    if (this.document.doc_type === 'document') {
      this.document['ext'] = 'html';
      content = '<!DOCTYPE html><html>'
        + '<head><meta charset="utf-8"><title></title></head>'
        + '<body>' + content + '</body></html>';
    } else if (this.document.doc_type === 'diagram') {
      this.document['ext'] = 'xml';
    } else if (this.document.doc_type === 'spreadsheet') {
      const arrayBuffer = this.base64ToArrayBuffer(this.content);
      const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      content = new Blob([arrayBuffer], {type: fileType});
      this.document['ext'] = 'xlsx';
    } else if (this.document.doc_type === 'ocr') {
      this.document['ext'] = 'html';
    } else if (this.document.doc_type === 'presentation') {
      this.document['ext'] = 'html';
    } else if (this.document.doc_type === 'drawing') {
      this.document['ext'] = 'png';
    }

    file = new File(this.document.doc_type === 'ocr' ? [content.content] : [content], `${this.document.name}.${this.document['ext']}`);
    this.document['document'] = file;

    if (this.document.doc_type === 'ocr') {
      this.document['ocr_image'] = this.content.ocr_image;
      content.content = '<!DOCTYPE html><html>'
        + '<head><meta charset="utf-8"><title></title></head>'
        + '<body>' + content.content.trim() + '</body></html>';
    }

    const formData = new FormDataPolyfill();

    for (const key in this.document) {
      if (this.document[key]) {
        formData.append(key, this.document[key]);
      }
    }

    return formData;
  }

  private createDocument() {
    if (this.isSaving) {
      return;
    }
    this.isSaving = true;
    const formData = this.getFormData();
    this.documentsService.createDocument(formData)
      .subscribe((document: DocumentModel) => {
        this.lastSaved = new Date();
        this.document = document;
        this.isSaving = false;
      });
  }

  private updateDocument() {
    if (this.isSaving) {
      return;
    }
    this.isSaving = true;
    const formData = this.getFormData();
    this.documentsService.saveDocument(formData, this.document.id)
      .subscribe((document: DocumentModel) => {
        this.lastSaved = new Date();
        this.document = document;
        this.isSaving = false;
      });
  }
}

export class OcrData {
  content: string;
  ocr_image: string;
}
