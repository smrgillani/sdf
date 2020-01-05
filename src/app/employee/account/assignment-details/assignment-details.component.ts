import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/Rx'

import { OrderService } from 'app/founder/order-service/services/order.service';
import { NewServiceModel } from 'app/founder/order-service/models/new-service-model';

@Component({
  selector: 'app-assignment-details',
  templateUrl: './assignment-details.component.html',
  styleUrls: ['./assignment-details.component.scss']
})
export class AssignmentDetailsComponent implements OnInit {

  id: number;
  orderServiceInfo: NewServiceModel;

  constructor(private route: ActivatedRoute, private router: Router,
    private _location: Location, private orderService: OrderService) {
    this.orderServiceInfo = new NewServiceModel();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.getOrderServiceInfo();
    });
  }

  getOrderServiceInfo() {
    this.orderService.getOrderServiceInfo(this.id).subscribe((info: any) => {      
      this.orderServiceInfo = info;
    });
  }

}
