import { Component } from '@angular/core';
import FormDataPolyfill from 'formdata-polyfill/formdata.min';
import * as moment from 'moment';

import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { OrderService } from 'app/founder/order-service/services/order.service';
import { NewServiceModel } from 'app/founder/order-service/models/new-service-model';
import { WorkDocumentModel } from 'app/founder/order-service/models/work-document-model';
import DocumentModel from 'app/core/models/DocumentModel';
import { ServiceExtensionComponent } from './service-extension/service-extension.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.scss'],
  providers: [OrderService, PaginationMethods],
})
export class AssignmentsComponent {
  searchText: '';
  pageSize = 5;
  count: number;
  orderServiceList: NewServiceModel[] = [];
  isFileSizeExceed = false;
  showFD = false;
  updateOrderServiceInfo = new NewServiceModel();
  dropZoneChartTemplate = '<div class="file-droppa-document-image file-droppa-passport"></div>';
  flagResume = false;
  private selectedId: number;
  private currentSize: number;
  private formDataList: FormDataPolyfill[] = [];

  constructor(
    private orderService: OrderService,
    private modalService: NgbModal,
  ) {}

  getOrderServiceList(newPage) {
    if (newPage) {
      this.orderService.getOrderServiceListForEmp(newPage, this.pageSize, this.searchText)
        .subscribe((listInfo: any) => {
          this.orderServiceList = listInfo['results'];
          this.count = listInfo['count'];
        });
    }
  }

  showFileDroppa(id) {
    this.updateOrderServiceInfo = new NewServiceModel();
    this.showFD = !this.showFD;
    this.flagResume = false;
    this.updateOrderServiceInfo.id = this.selectedId = id;
  }

  FilesUpdated(files) {
    this.updateOrderServiceInfo.work_documents = [];
    this.formDataList = [];
    this.isFileSizeExceed = false;
    if (files && files.length > 0) {
      this.currentSize = files.map(a => a.size).reduce((sum, current) => sum + current);
      this.isFileSizeExceed = ((this.currentSize) > 6000000);

      const internalFiles: File[] = files; // files.reverse();

      internalFiles.forEach((file, index, arr) => {
        const fileReader: FileReader = new FileReader();
        const self = this;
        const fileType = file.name.substring(file.name.lastIndexOf('.') + 1);
        fileReader.addEventListener('loadend', function (loadEvent: any) {
          const document: DocumentModel = new DocumentModel();
          const doc: WorkDocumentModel = new WorkDocumentModel();
          const formData = new FormDataPolyfill();

          document['document_name'] = doc.document_name = file.name.split('.')[0];
          document['ext'] = doc.ext = fileType;
          doc.id = 0;
          doc.size = file.size;
          document['service'] = doc.service = self.updateOrderServiceInfo.id;
          document['is_upload'] = doc.is_upload = true;

          let file1: File;
          file1 = new File([loadEvent.target.result], `${document['document_name']}.${document['ext']}`);
          document['document'] = file1;

          for (const key in document) {
            if (document[key]) {
              formData.append(key, document[key]);
            }
          }

          self.formDataList.push(formData);
          self.updateOrderServiceInfo.work_documents.push(doc);
        });
        fileReader.readAsArrayBuffer(file);
      });
    }
  }

  /**
   * This method is called once your drop or select files
   * You can validate and decline or accept file
   *
   * @param file
   * @returns Boolean
   */
  beforeAddFile(file) {
    return !!file.name.substring(file.name.toLowerCase().lastIndexOf('.') + 1);
  }

  removeID() {
    this.updateOrderServiceInfo.document_name = this.updateOrderServiceInfo.document = '';
    this.dropZoneChartTemplate = '<div class="file-droppa-document-image file-droppa-passport"></div>';
    this.flagResume = !this.flagResume;
  }

  putOrderServiceInfo() {
    const arraylength = this.formDataList.length;
    for (let index = 0; index < this.formDataList.length; index++) {
      this.orderService.postNewWorkAttachmentsService(this.formDataList[index]).subscribe((info) => {
        if (index === (arraylength - 1)) {
          this.updateStatus('review', this.updateOrderServiceInfo.id);
        }
      }, (error) => {
        console.log(error);
      });

    }
  }

  updateStatus(status: string, orderId: number) {
    this.updateOrderServiceInfo.id = orderId;
    this.updateOrderServiceInfo.status = status;

    const data: any = this.updateOrderServiceInfo;
    if (status === 'work') {
      this.updateOrderServiceInfo.start_date = new Date();
      data.start_date = moment(new Date()).format('YYYY-MM-DD HH:mm');
    }

    this.orderService.putNewService(data).subscribe((info) => {
      this.updateOrderServiceInfo = new NewServiceModel();
      this.formDataList = [];
      this.showFD = false;
      this.getOrderServiceList(1);
    }, (error) => {
      console.log(error);
    });
  }

  downloadSample(id: number) {
    this.orderService.downloadSampleOnId(id).subscribe((obj) => {
      const link = document.createElement('a');
      const fileReader = new FileReader();

      link.download = 'sample_Attachments.zip';
      fileReader.readAsDataURL(obj);
      fileReader.onloadend = (event: ProgressEvent) => {
        if (event.target['result']) {
          link.href = event.target['result'];

          link.click();
        }
      };
    }, (errorMsg: any) => {
      console.log(errorMsg);
    });
  }

  showExtensionPopUp(item) {
    console.log(item);
    const modalRef = this.modalService.open(ServiceExtensionComponent, {
      windowClass: 'interviewmodel',
    });
    modalRef.componentInstance.orderId = item.id;
    modalRef.componentInstance.emitService.subscribe((emmitedValue) => {
      if (emmitedValue === true) {
        this.getOrderServiceList(1);
      }
    });
  }
}
