import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';

import { BlockService } from 'app/block-explore/block-explores/services/block.service';
import { BlockSummaryModel } from 'app/block-explore/block-explores/models/block-summary-model';

@Component({
  selector: 'app-block-summary',
  templateUrl: './block-summary.component.html',
  styleUrls: ['./block-summary.component.scss']
})
export class BlockSummaryComponent implements OnInit {

  block: number;
  blockSummaryInfo: BlockSummaryModel;

  constructor(private blockService: BlockService, 
    private route: ActivatedRoute,
    private _location: Location) { this.blockSummaryInfo = new BlockSummaryModel(); }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.block = params["block"];
      this.getBlockInfo();
    });
  }

  getBlockInfo() {
    this.blockService.getEthBlockInfoById(this.block).subscribe((info) => {
      //this.chainInfo = info;
      this.blockSummaryInfo = info;
    });
  }

}
