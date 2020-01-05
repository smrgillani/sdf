import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import TaskModel from 'app/core/models/TaskModel';
import {DocumentExplorerItem} from 'app/elements/document-explorer/DocumentExplorerItem';
import {FolderNavigation} from 'app/elements/document-explorer/FolderNavigation';
import {DocumentsService} from 'app/projects/documents.service';
import {TasksService} from 'app/projects/tasks.service';

import {ProcessItem} from 'app/collaboration/document-explorer/ProcessItem';
import {DocumentItem} from '../document-explorer/DocumentItem';


@Component({
  templateUrl: './process-documents.component.html',
  styleUrls: ['./process-documents.component.scss']
})
export class CollaborationProcessDocumentsComponent implements OnInit {
  process: ProcessItem;
  documents: DocumentExplorerItem[];
  documentType = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentsService: DocumentsService,
    private folderNavigation: FolderNavigation,
    private tasksService: TasksService
  ) {
    this.documents = [];
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const processId = params['processId'];
      this.loadDocuments(processId);
    });
  }

  loadDocuments(processId: number) {
    this.documents = [];
    this.tasksService.get(processId).subscribe((process: TaskModel) => {
      this.process = new ProcessItem(process);
      this.folderNavigation.opened.emit(this.process);
      if (process.documents) {
        for (const document of process.documents) {
          const documentItem = new DocumentItem(document);
          documentItem.parent = this.process;
          this.documents.push(documentItem);
          this.folderNavigation.addItem(documentItem);
        }
      }
    });
  }

  createDocument(type: string) {
    this.router.navigate([{
      outlets: {
        documents: ['document', type=='upload'?'upload':'new', {type: type, process: this.process.resource.id}],
        chat: ['chat', this.process.resource.id]
      }
    }], {relativeTo: this.route.parent});
  }

  renameDocument(item: DocumentItem, name: string) {
    this.documentsService.rename(name, item.resource.id).subscribe(() => {
      this.loadDocuments(this.process.resource.id);
    });
  }

  percentageDocument(item: DocumentItem, percentage: number) {
    this.documentsService.percentageChange(percentage, item.resource.id).subscribe(() => {
      this.loadDocuments(this.process.resource.id);
    });
  }

  exportDocument(document: any) {
    this.documentsService.exportDocument(document.document);
  }

  deleteDocument(item: DocumentItem) {
    this.documentsService.delete(item.resource.id).subscribe(() => {
      this.loadDocuments(this.process.resource.id);
    });
  }

  openDocument(document: DocumentExplorerItem) {
    this.folderNavigation.open(document);
    this.router.navigate([{
      outlets: {
        documents: ['document', document.resource.id],
        chat: ['chat', this.process.resource.id]
      }
    }], {relativeTo: this.route.parent});
  }
}
