import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import FormDataPolyfill from 'formdata-polyfill/formdata.min';
import * as mammoth from 'mammoth';

import DocumentModel from 'app/core/models/DocumentModel';
import { DocumentsService } from 'app/projects/documents.service';
import { OrderService } from 'app/founder/order-service/services/order.service';
import { DocumentItem } from 'app/backer/my-projects/collaboration/document-explorer/DocumentItem';


@Component({
  template: `
    <div *ngIf="documentItem" class="document-container">
      <div [ngSwitch]="document.doc_type" class="document-element">
        <div *ngSwitchCase="'document'" class="document">
          <app-text-editor [(ngModel)]="content" [readOnly]="readOnly"></app-text-editor>
        </div>

        <div *ngSwitchCase="'diagram'" class="document diagram">
          <div class="diagram-container">
            <app-edit-drawing [(ngModel)]="content"></app-edit-drawing>
          </div>
        </div>

        <div *ngSwitchCase="'spreadsheet'" class="document">
           <app-spreadsheet [(ngModel)]="content" [isReadOnly]="readOnly"></app-spreadsheet>
        </div>

        <div *ngSwitchCase="'drawing'" class="document">
          <div class="diagram-container">
            <app-edit-drawing [(ngModel)]="content"></app-edit-drawing>
          </div>
        </div>

        <div *ngSwitchCase="'ocr'" class="document">
          <div class="diagram-container">
            <app-ocr-input [(ngModel)]="content" [isWorkArea]="true" [viewOnly]="readOnly"></app-ocr-input>
          </div>
        </div>

        <div *ngSwitchCase="'presentation'" class="document">
          <app-presentation-input [(ngModel)]="content"></app-presentation-input>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .document-container {
      height: calc(100% - 39px);
    }
    
    .document-element {
      height: 100%;
      border-top: 1px solid transparent;
    }
    
    .document {
      height: 100%;
    }
    
    .diagram-container {
      margin: 24px;
      background-color: #fff;
      height: calc(100% - 48px);
      overflow: auto;
      padding: 15px;
    }
    
    .document.diagram {
      border-top: 1px solid transparent;
    }
    
    @media only screen and (max-width: 600px) {
      .diagram-container {
        margin: 15px;
        background-color: #fff;
        height: calc(100% - 30px);
      }
    }
  `]
})
export class BackerServiceDocumentComponent implements OnInit {
  documentItem: DocumentItem;
  document: DocumentModel;
  content = null;
  isSaving: boolean;
  readOnly: boolean = true;// For creator only

  constructor(
    private route: ActivatedRoute,
    private documentsService: DocumentsService,
    private orderService: OrderService
  ) {
    this.document = new DocumentModel();
    this.documentItem = null;
    this.isSaving = false;
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const documentId = params['documentId'];
      const serviceId = params['service'];
      this.getDocument(documentId, serviceId);
    });
  }

  getDocument(id: number, serviceId: number) {
    this.orderService.get(id).flatMap((document: DocumentModel) => {
      this.document = document;
      this.document['document_name'] = this.document['name'];
      this.documentsService.getDocument(this.document['document'])
        .subscribe((blob: Blob) => {
          this.parseDocument(blob);
        });
      this.documentItem = new DocumentItem(document);
      return this.orderService.getOrderServiceInfo(serviceId);
    }).subscribe((info: any)=> {
      console.log(info);
      /*if(info == 'review') {
        this.readOnly = true;
      }*/
    });
  }

  parseDocument(blob: Blob) {
    const fileReader = new FileReader();
    if (this.document['ext'] === 'docx') {
      fileReader.readAsArrayBuffer(blob);

      fileReader.onloadend = (event: ProgressEvent) => {
        mammoth['convertToHtml']({ arrayBuffer: event.target['result'] })
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

  base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  getFormData(): FormDataPolyfill {
    let file: File;
    let content = this.content;

    if (this.document.doc_type === 'document') {
      this.document['ext'] = 'html';
    } else if (this.document.doc_type === 'diagram') {
      this.document['ext'] = 'xml';
    } else if (this.document.doc_type === 'spreadsheet') {
      const arrayBuffer = this.base64ToArrayBuffer(this.content);
      const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      content = new Blob([arrayBuffer], { type: fileType });
      this.document['ext'] = 'xlsx';
    } else if (this.document.doc_type === 'ocr') {
      this.document['ext'] = 'txt';
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
}
