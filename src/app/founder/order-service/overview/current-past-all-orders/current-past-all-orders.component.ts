import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from 'app/founder/order-service/services/order.service';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { NewServiceModel } from 'app/founder/order-service/models/new-service-model';
import { DocumentsService } from 'app/projects/documents.service';
import { WorkDocumentModel } from 'app/founder/order-service/models/work-document-model';

@Component({
  selector: 'app-current-past-all-orders',
  templateUrl: './current-past-all-orders.component.html',
  styleUrls: ['./current-past-all-orders.component.scss'],
  providers: [PaginationMethods, DocumentsService]
})
export class CurrentPastAllOrdersComponent implements OnInit {

  @Input() orderType: string;
  @Input() projectId: number;
  searchText: '';
  pageSize = 5;
  count: number;
  orderServiceList: NewServiceModel[];
  is_fileSizeExceed: boolean = false;
  showFD: boolean = false;
  showConflictRemark: boolean = false;
  selectedId: number;
  updateOrderServiceInfo: NewServiceModel;
  currentSize: number;
  dropZoneChartTemplate: string;

  constructor(private orderService: OrderService, private documentsService: DocumentsService) {
    this.orderServiceList = [];
    this.updateOrderServiceInfo = new NewServiceModel();
    this.dropZoneChartTemplate = `<div class="file-droppa-document-image file-droppa-passport"></div>`;
  }

  ngOnInit() {
  }

  getOrderServiceList(newPage) {
    if (newPage) {
      this.orderService.getOrderServiceList(newPage, this.pageSize, this.searchText, this.orderType, this.projectId).subscribe((listInfo: any) => {
        this.orderServiceList = listInfo['results'];
        this.count = listInfo['count'];
      });
    }
  }

  showFileDroppa(id) {
    this.updateOrderServiceInfo = new NewServiceModel();
    this.showFD = !this.showFD;
    this.selectedId = id;
  }

  showCR(id) {
    this.updateOrderServiceInfo = new NewServiceModel();
    this.showConflictRemark = !this.showConflictRemark;
    this.selectedId = id;
  }

  FilesUpdated(files) {
    this.updateOrderServiceInfo.sample_attachments = [];//.setValue([]);

    this.is_fileSizeExceed = false;
    if (files && files.length > 0) {
      this.currentSize = files.map(a => a.size).reduce((sum, current) => sum + current);
      this.is_fileSizeExceed = ((this.currentSize) > 6000000);

      const internalfiles: File[] = files;//files.reverse();

      internalfiles.forEach((file, index, arr) => {
        const fileReader: FileReader = new FileReader();
        const self = this;
        let fileType = file.name.substring(file.name.lastIndexOf('.') + 1);
        fileReader.addEventListener('loadend', function (loadEvent: any) {
          let doc: WorkDocumentModel = new WorkDocumentModel();
          doc.document = loadEvent.target.result;
          doc.document_name = file.name;
          doc.ext = fileType;
          doc.id = 0;
          doc.size = file.size;
          self.updateOrderServiceInfo.sample_attachments.push(doc);
        });
        fileReader.readAsDataURL(file);
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
    let fileExt: string = file.name.substring(file.name.toLowerCase().lastIndexOf('.') + 1);
    if (fileExt) {
      return true;
    }
    return false;
  }

  putOrderServiceInfo() {
    this.updateOrderServiceInfo.id = this.selectedId;
    this.orderService.putNewService(this.updateOrderServiceInfo).subscribe((info) => {
      this.updateOrderServiceInfo = new NewServiceModel();
      this.showFD = false;
    }, (error) => {
      console.log(error);
    });
  }

  downloadFile(id: number) {
    this.orderService.downloadWorkOnId(id).subscribe((obj) => {

      var link = document.createElement('a');
      link.download = "Work_Attachments.zip";

      const fileReader = new FileReader();
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

  updateStatus(status: string, orderId: number) {
    this.updateOrderServiceInfo.id = orderId;
    this.updateOrderServiceInfo.status = status;
    this.orderService.putNewService(this.updateOrderServiceInfo).subscribe((info) => {
      this.updateOrderServiceInfo = new NewServiceModel();
      this.showFD = false;
      this.showConflictRemark = false;
      this.selectedId = 0;
      this.getOrderServiceList(1);
    }, (error) => {
      console.log(error);
    });
  }

}
