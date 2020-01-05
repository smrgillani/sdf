import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import TaskModel from 'app/core/models/TaskModel';
import { DocumentExplorerItem } from 'app/elements/document-explorer/DocumentExplorerItem';
import { FolderNavigation } from 'app/elements/document-explorer/FolderNavigation';
import { DocumentsService } from 'app/projects/documents.service';
import { TasksService } from 'app/projects/tasks.service';

import * as moment from 'moment';

import { ProcessItem } from 'app/collaboration/document-explorer/ProcessItem';
import { DocumentItem } from '../document-explorer/DocumentItem';
import { StopTimerComponent } from 'app/employee/account/collaboration/process-documents/stop-timer/stop-timer.component';


@Component({
  templateUrl: './process-documents.component.html',
  styleUrls: ['./process-documents.component.scss'],
})
export class CollaborationProcessDocumentsComponent implements OnInit, OnDestroy {
  process: ProcessItem;
  documents: DocumentExplorerItem[];
  documentType = '';
  errorMessage = '';
  timerstart = false;
  private subscription: Subscription;
  startDate: moment.Moment;
  activeSessionId: number;
  private timer: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentsService: DocumentsService,
    private folderNavigation: FolderNavigation,
    private tasksService: TasksService,
    private modalService: NgbModal,
  ) {
    this.documents = [];
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const processId = params['processId'];
      this.loadDocuments(processId);
      this.tasksService.getActiveWorkSession(processId).subscribe((data) => {
        if (data != null && data.active_session != null && data.session_related_to_same_project) {
          if (data.active_session.task == processId) {
            this.startDate = moment(new Date(data.active_session.start_datetime));
            this.activeSessionId = data.active_session.id;
            this.showTimer();
          } else {
            this.errorMessage = `Already working on another process "${data.active_session.task_title}"`;
            setTimeout(() => {
              this.errorMessage = '';
            }, 4000);
          }
        }
      }, (error) => {
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = '';
        }, 4000);
      });
    });
  }

  resourceId() {
    if (this.process && this.process.resource.id) {
      return this.process.resource.id;
    }
    return null;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  showTimer() {
    const timer = TimerObservable.create(4000, 1000);
    this.timerstart = true;
    this.subscription = timer.subscribe(t => {
      const start = this.startDate;
      const current = moment(new Date());
      const duration = moment.duration(current.diff(start));

      this.timer = `${current.diff(start, 'hours')}:${current.diff(start, 'minutes') % 60}:${current.diff(start, 'seconds') % 60}`;
    });
  }

  startTimer() {
    console.log(this.process.resource.id);
    if (!this.activeSessionId) {
      this.tasksService.startActiveWorkSession(this.process.resource.id).subscribe((data) => {
        this.startDate = moment(new Date(data.start_datetime));
        this.showTimer();
      }, (error) => {
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = '';
        }, 4000);
      });
    }
  }

  stopTimer() {
    console.log(this.process.resource.id);
    if (this.activeSessionId) {
      const start = this.startDate;
      const current = moment(new Date());
      const duration = moment.duration(current.diff(start));

      const loggedIn_Hours = `${current.diff(start, 'hours')}:${current.diff(start, 'minutes') % 60}`;

      const modalRef = this.modalService.open(StopTimerComponent, {
        windowClass: 'timermodel interviewmodel modal-dialog-centered',
      });
      modalRef.componentInstance.hours = current.diff(start, 'hours');
      modalRef.componentInstance.mins = current.diff(start, 'minutes') % 60;
      modalRef.componentInstance.activeSessionId = this.activeSessionId;
      modalRef.result.then((result) => {
        console.log(`Closed with: ${result}`);
        this.timer = '';
        this.timerstart = false;
        this.activeSessionId = null;
        this.subscription.unsubscribe();
      }, (reason) => {
        this.errorMessage = reason;
        setTimeout(() => {
          this.errorMessage = '';
        }, 4000);
      });
    }
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
        documents: ['document', type == 'upload' ? 'upload' : 'new', {type: type, process: this.process.resource.id}],
        chat: ['chat', this.process.resource.id],
      },
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
        chat: ['chat', this.process.resource.id],
      },
    }], {relativeTo: this.route.parent});
  }
}
