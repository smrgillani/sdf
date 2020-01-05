import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { LoaderService } from 'app/loader.service';
import { OrderService } from 'app/founder/order-service/services/order.service';
import { RateSlabModel } from 'app/founder/order-service/models/rate-slab-model';

@Component({
  selector: 'app-rate-slab',
  templateUrl: './rate-slab.component.html',
  styleUrls: ['./rate-slab.component.scss']
})
export class RateSlabComponent implements OnInit {
  @Input() id;
  rateSlabListInfo: RateSlabModel[];
  constructor(private loaderService: LoaderService,
    private orderService: OrderService,
    public activeModal: NgbActiveModal) { 
      this.rateSlabListInfo = [];
    }

  ngOnInit() {
    this.getRateSlab();
  }

  getRateSlab() {
    this.orderService.getRateSlabList().subscribe((infoList)=>{
      this.rateSlabListInfo = infoList;
    });
  }

}
