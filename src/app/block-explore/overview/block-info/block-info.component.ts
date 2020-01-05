import { Component, OnInit } from '@angular/core';

import { BlockService } from 'app/block-explore/block-explores/services/block.service';

@Component({
  selector: 'app-block-info',
  templateUrl: './block-info.component.html',
  styleUrls: ['./block-info.component.scss']
})
export class BlockInfoComponent implements OnInit {

  chainInfo: any;

  constructor(private blockService: BlockService) { }

  ngOnInit() {
    this.getBlockChainBasicInfo();
  }

  getBlockChainBasicInfo() {
    this.blockService.getEthBlockBasicInfo().subscribe((info) => {
      this.chainInfo = info;
    });
  }

}
