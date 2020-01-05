import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {Subscription} from "rxjs";

import {DocumentExplorerItem} from 'app/elements/document-explorer/DocumentExplorerItem';
import {FolderNavigation} from 'app/elements/document-explorer/FolderNavigation';

import * as moment from 'moment';




import { OrderService } from 'app/founder/order-service/services/order.service';
import { NewServiceModel } from 'app/founder/order-service/models/new-service-model';
import { ProcessItem } from 'app/collaboration/document-explorer/ProcessItem';
import { DocumentItem } from 'app/backer/my-projects/collaboration/document-explorer/DocumentItem';


@Component({
  templateUrl: './backer-services-documents.component.html',
  styleUrls: ['./backer-services-documents.component.scss']
})
export class BackerServicesDocumentsComponent implements OnInit, OnDestroy {
  process: ProcessItem;
  documents: DocumentExplorerItem[];
  documentType = '';
  errorMessage = '';
  timerstart:boolean=false;
  private subscription: Subscription;
  startDate:moment.Moment;
  activeSessionId:number;

  order: number;
  orderServiceInfo: NewServiceModel;
  readonly: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private folderNavigation: FolderNavigation,
    private orderService: OrderService
  ) {
    this.order = parseInt(this.route.snapshot.params["orderid"]);
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

  loadDocuments(order: number) {
    this.documents = [];
    this.orderService.getOrderServiceInfo(order).subscribe((info: any) => {
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

  openDocument(document: DocumentExplorerItem) {
    this.router.navigate(['document', document.resource.id, {service: this.order}], {relativeTo: this.route.parent});
  }
}
