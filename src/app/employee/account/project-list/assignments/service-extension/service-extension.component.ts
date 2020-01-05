import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

import { OrderService } from 'app/founder/order-service/services/order.service';
import { NewServiceModel } from 'app/founder/order-service/models/new-service-model';

@Component({
  selector: 'app-service-extension',
  templateUrl: './service-extension.component.html',
  styleUrls: ['./service-extension.component.scss']
})
export class ServiceExtensionComponent implements OnInit {

  @Input() orderId: number;
  @Output() emitService = new EventEmitter();
  objKeyMessage: any;
  updateOrderServiceInfo: NewServiceModel;
  expected_complete_date: Date = moment().add(1, 'days').minute(0).add(0).second(0).toDate();


  constructor(public activeModal: NgbActiveModal,
    private orderService: OrderService) {
    this.updateOrderServiceInfo = new NewServiceModel();
    this.updateOrderServiceInfo.revised_date = this.expected_complete_date;
  }

  ngOnInit() {
    //this.expected_complete_date = moment().minute(5).second(0).toDate();
  }

  extensionService(form) {
    this.updateOrderServiceInfo.id = this.orderId;
    let demo: any = Object.assign({}, this.updateOrderServiceInfo);
    demo.revised_date = moment(this.updateOrderServiceInfo.revised_date).format('YYYY-MM-DD HH:mm');
    let data = {
      service: this.orderId,
      revised_date: demo.revised_date
    }

    this.orderService.postExtensionService(data).subscribe((info) => {
      this.emitService.next(true);
      this.activeModal.close();
    }, (errorMsg: any) => {
      this.checkForErrors(errorMsg, form);
    });
  }

  checkForErrors(errorMsg, form?) {
    let newErr = {};
    this.objKeyMessage = errorMsg;
    Object.keys(errorMsg).forEach((err) => {
      newErr[err] = true;
      form && form.controls[err] ? form.controls[err].setErrors(newErr)
        : form.controls['common'].setErrors(newErr);
    });
  }

}
