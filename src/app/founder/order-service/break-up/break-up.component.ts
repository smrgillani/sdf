import { Component, OnInit, Input } from '@angular/core';
import { RateSlabModel } from 'app/founder/order-service/models/rate-slab-model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-break-up',
  templateUrl: './break-up.component.html',
  styleUrls: ['./break-up.component.scss']
})
export class BreakUpComponent implements OnInit {
  @Input() rateSlabModel: RateSlabModel;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
