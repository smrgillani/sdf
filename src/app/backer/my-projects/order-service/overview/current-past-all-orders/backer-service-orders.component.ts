import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from 'app/founder/order-service/services/order.service';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { NewServiceModel } from 'app/founder/order-service/models/new-service-model';
import { DocumentsService } from 'app/projects/documents.service';
import { WorkDocumentModel } from 'app/founder/order-service/models/work-document-model';

@Component({
    selector: 'app-backer-service-orders',
    templateUrl: './backer-service-orders.component.html',
    styleUrls: ['./backer-service-orders.component.scss'],
    providers: [PaginationMethods, DocumentsService]
})
export class BackerServiceOrdersComponent implements OnInit {

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
}