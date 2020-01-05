import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { OrderService } from 'app/founder/order-service/services/order.service';

@Component({
  selector: 'app-service-extension-approve-reject',
  templateUrl: './service-extension-approve-reject.component.html',
  styleUrls: ['./service-extension-approve-reject.component.scss'],
  providers: [OrderService]
})
export class ServiceExtensionApproveRejectComponent implements OnInit {

  @Input() id: number;
  extensionInfo: any;
  @Output() emitService = new EventEmitter();

  constructor(public activeModal: NgbActiveModal,
    private orderService: OrderService) { }

  ngOnInit() {
    this.orderService.getExtensionServiceInfo(this.id).subscribe((info) => {
      this.extensionInfo = info;
    });
  }

  updateExtensionStatus(status: string) {
    this.extensionInfo.status = status;
    this.orderService.putExtensionService(this.extensionInfo).subscribe((info) => {
      this.extensionInfo = info;
      this.emitService.next(true);
      this.activeModal.close();
    })

  }

}
