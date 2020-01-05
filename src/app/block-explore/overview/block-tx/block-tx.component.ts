import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';

import { BlockService } from 'app/block-explore/block-explores/services/block.service';

@Component({
  selector: 'app-block-tx',
  templateUrl: './block-tx.component.html',
  styleUrls: ['./block-tx.component.scss']
})
export class BlockTxComponent implements OnInit {

  tx: string;
  txData: any;

  constructor(private blockService: BlockService, 
    private route: ActivatedRoute,
    private _location: Location) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.tx = params["tx"];
      this.getTx();
    });
  }

  getTx() {
    this.blockService.searchEthBlockExplorer(this.tx).subscribe((info) => {
      this.txData = info;
    });
  }

}
