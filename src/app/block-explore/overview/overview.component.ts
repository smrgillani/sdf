import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

import { BlockService } from 'app/block-explore/block-explores/services/block.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class BlockOverviewComponent implements OnInit {

  constructor(private blockService: BlockService, private _location: Location) { }

  ngOnInit() {
    this.blockService.getEthBlockListInfo().subscribe((infoList)=>{
      //console.log(infoList);
    });
  }

}
