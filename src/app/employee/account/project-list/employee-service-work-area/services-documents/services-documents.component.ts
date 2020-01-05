import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {Subscription} from "rxjs";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import TaskModel from 'app/core/models/TaskModel';
import {DocumentExplorerItem} from 'app/elements/document-explorer/DocumentExplorerItem';
import {FolderNavigation} from 'app/elements/document-explorer/FolderNavigation';
import {DocumentsService} from 'app/projects/documents.service';
import {TasksService} from 'app/projects/tasks.service';

import * as moment from 'moment';

import {ProcessItem} from 'app/collaboration/document-explorer/ProcessItem';
import {DocumentItem} from '../document-explorer/DocumentItem';
import { StopTimerComponent } from 'app/employee/account/collaboration/process-documents/stop-timer/stop-timer.component';


import { OrderService } from 'app/founder/order-service/services/order.service';
import { NewServiceModel } from 'app/founder/order-service/models/new-service-model';


@Component({
  templateUrl: './services-documents.component.html',
  styleUrls: ['./services-documents.component.scss']
})
export class ServicesDocumentsComponent implements OnInit, OnDestroy {
  process: ProcessItem;
  documents: DocumentExplorerItem[];
  documentType = '';
  errorMessage = '';
  timerstart:boolean=false;
  private subscription: Subscription;
  startDate:moment.Moment;
  activeSessionId:number;
  private timer:string;

  order: number;
  orderServiceInfo: NewServiceModel;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentsService: DocumentsService,
    private folderNavigation: FolderNavigation,
    private tasksService: TasksService,
    private modalService: NgbModal,
    private orderService: OrderService
  ) {
    this.order = parseInt(this.route.snapshot.params["id"]);
    this.documents = [];
  }

  ngOnInit() {
    this.loadDocuments(this.order);
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  showTimer(){
    /*let timer = TimerObservable.create(4000, 1000);
    this.timerstart = true;
    this.subscription = timer.subscribe(t => {
      let start = this.startDate;
      let current = moment(new Date());
      let duration = moment.duration(current.diff(start));

      this.timer = `${current.diff(start,'hours')}:${current.diff(start,'minutes')%60}:${current.diff(start,'seconds')%60}`
    });*/
  }

  startTimer(){
    /*console.log(this.process.resource.id);
    if(!this.activeSessionId){
      this.tasksService.startActiveWorkSession(this.process.resource.id).subscribe((data)=>{
        this.startDate = moment(new Date(data.start_datetime));
        this.showTimer();
      },(error)=>{
        this.errorMessage = error;
        setTimeout(()=>{
          this.errorMessage = '';
        },4000);
      });
    }*/
  }

  stopTimer(){
    /*console.log(this.process.resource.id);
    if(this.activeSessionId){
      let start = this.startDate;
      let current = moment(new Date());
      let duration = moment.duration(current.diff(start));

      let loggedIn_Hours = `${current.diff(start,'hours')}:${current.diff(start,'minutes')%60}`

      const modalRef = this.modalService.open(StopTimerComponent, {
        windowClass: 'timermodel interviewmodel modal-dialog-centered'
      });
      modalRef.componentInstance.hours = current.diff(start,'hours');
      modalRef.componentInstance.mins = current.diff(start,'minutes')%60;
      modalRef.componentInstance.activeSessionId = this.activeSessionId;
      modalRef.result.then((result) => {
        console.log(`Closed with: ${result}`);
        this.timer = '';
        this.timerstart=false;
        this.activeSessionId = null;
        this.subscription.unsubscribe();
      }, (reason) => {
        this.errorMessage = reason;
        setTimeout(() => {
            this.errorMessage = '';
        }, 4000);
      })
    }*/
  }

  loadDocuments(processId: number) {
    this.documents = [];
    this.orderService.getOrderServiceInfo(this.order).subscribe((info: any) => {
      this.orderServiceInfo = info;
      if (info.work_documents && info.work_documents.length > 0) {
        for (const document of info.work_documents.filter(a=>a.is_upload == false)) {

          document['name'] = document['document_name'];

          const documentItem = new DocumentItem(document);
          documentItem.parent = this.process;
          this.documents.push(documentItem);
          this.folderNavigation.addItem(documentItem);
        }
      }
    });
  }

  createDocument(type: string) {
    this.router.navigate(['document', 'new', {type: type, service: this.order}], {relativeTo: this.route.parent});
  }

  renameDocument(item: DocumentItem, name: string) {
    this.orderService.rename(name, item.resource.id).subscribe(() => {
      this.loadDocuments(this.order);
    });
  }

  percentageDocument(item: DocumentItem, percentage: number) {
    this.orderService.percentageChange(percentage, item.resource.id).subscribe(() => {
      this.loadDocuments(this.order);
    });
  }

  deleteDocument(item: DocumentItem) {
    this.orderService.delete(item.resource.id).subscribe(() => {
      this.loadDocuments(this.order);
    });
  }

  openDocument(document: DocumentExplorerItem) {
    this.router.navigate(['document', document.resource.id, {service: this.order}], {relativeTo: this.route.parent});
  }
}
