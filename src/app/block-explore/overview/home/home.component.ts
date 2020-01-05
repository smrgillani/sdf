import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BlockService } from 'app/block-explore/block-explores/services/block.service';
import { BlockListinfoModel } from 'app/block-explore/block-explores/models/block-listinfo-model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  blockListinfoModel: BlockListinfoModel;
  searchText: string;
  errorMessage: string;

  constructor(private blockService: BlockService, private route: ActivatedRoute,
    private router: Router) { 
    this.blockListinfoModel = new BlockListinfoModel();
  }

  ngOnInit() {
    this.getBlockChainInfoList();
  }

  getBlockChainInfoList() {
    this.blockService.getEthBlockListInfo().subscribe((infoList) => {
      this.blockListinfoModel = infoList;
    });
  }

  ngOnDestroy() {
  }

  valueChange() {
    this.errorMessage = undefined;
  }

  selectedBlock(block) {    
    this.router.navigate([`${block}/block`], {relativeTo: this.route});
  }

  searchBlockTxAddress() {
    
    if (this.searchText !== undefined) {

      // maybe we can create a service to do the reg ex test, so we can use it in every controller ?

      var regexpTx = /[0-9a-zA-Z]{64}?/;
      //var regexpAddr =  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/; // TODO ADDR REGEX or use isAddress(hexString) API ?
      var regexpAddr = /^(0x)?[0-9a-f]{40}$/; //New ETH Regular Expression for Addresses
      var regexpBlock = /[0-9]{1,7}?/;

      var result = regexpTx.test(this.searchText);
      if (result === true) {
        this.goToTxInfos(this.searchText)
      }
      else {
        result = regexpAddr.test(this.searchText.toLowerCase());
        if (result === true) {
          this.goToAddrInfos(this.searchText.toLowerCase())
        }
        else {
          result = regexpBlock.test(this.searchText);
          if (result === true) {
            this.goToBlockInfos(this.searchText)
          }
          else {
            return null;
          }
        }
      }
    }
    else {
      return null;
    }
  }

  goToTxInfos(searchText: string) {
    this.blockService.searchEthBlockExplorer(searchText).subscribe((info) => {
      if(info.blockNumber) {
        this.router.navigate([`${searchText}/tx`], {relativeTo: this.route});
      }
      else {
        this.errorMessage = "Details not found.";
      }
    }, (error)=>{
      console.log(error);
    });
  }

  goToAddrInfos(searchText: string) {
    this.blockService.searchEthBlockExplorer(searchText).subscribe((info) => {
      if(info.block_number){
        this.router.navigate([`${searchText}/address`], {relativeTo: this.route});
      }
      else {
        this.errorMessage = "Details not found.";
      }
    }, (error)=>{
      console.log(error);
    });
  }

  goToBlockInfos(searchText: string) {
    this.blockService.searchEthBlockExplorer(searchText).subscribe((info) => {
      if(info.block_number) {
        this.selectedBlock(info.block_number);
      }
      else {
        this.errorMessage = "Details not found.";
      }
    }, (error)=>{
      console.log(error);
    });
  }

}
