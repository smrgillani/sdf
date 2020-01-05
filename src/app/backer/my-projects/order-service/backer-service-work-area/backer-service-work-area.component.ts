import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { OrderService } from 'app/founder/order-service/services/order.service';
import { NewServiceModel } from 'app/founder/order-service/models/new-service-model';

@Component({
  selector: 'app-backer-service-work-area',
  templateUrl: './backer-service-work-area.component.html',
  styleUrls: ['./backer-service-work-area.component.scss']
})
export class BackerServiceWorkAreaComponent implements OnInit {

  isProcessesOpen = true;
  order: number;
  project: number
  activeMobileView: null | 'chat' | 'menu' | 'documents';
  orderServiceInfo: NewServiceModel;
  
  constructor(private route: ActivatedRoute, private orderService: OrderService) {
    this.activeMobileView = 'menu';
    this.order = parseInt(this.route.snapshot.params["orderid"]);
    this.project = parseInt(this.route.snapshot.params["id"]);
    this.orderServiceInfo = new NewServiceModel();
   }

  ngOnInit() {
    this.getOrderServiceInfo();
  }

  getOrderServiceInfo() {
    this.orderService.getOrderServiceInfo(this.order).subscribe((info: any) => {      
      this.orderServiceInfo = info;
    });
  }

}
