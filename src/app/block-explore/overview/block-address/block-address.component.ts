import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';

import { BlockService } from 'app/block-explore/block-explores/services/block.service';

@Component({
  selector: 'app-block-address',
  templateUrl: './block-address.component.html',
  styleUrls: ['./block-address.component.scss']
})
export class BlockAddressComponent implements OnInit {

  address: string;
  addressData: any;

  constructor(private blockService: BlockService, 
    private route: ActivatedRoute,
    private _location: Location) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.address = params["address"];
      this.getAddress();
    });
  }

  getAddress() {
    this.blockService.searchEthBlockExplorer(this.address.toLowerCase()).subscribe((info) => {
      this.addressData = info;
    });
  }

}
