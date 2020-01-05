import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { BlockService } from 'app/block-explore/block-explores/services/block.service';
import { FinancialTransactionsModel } from 'app/block-explore/block-explores/models/financial-transactions-model';

@Component({
  selector: 'app-financial-transactions',
  templateUrl: './financial-transactions.component.html',
  styleUrls: ['./financial-transactions.component.scss'],
  providers: [PaginationMethods]
})
export class FinancialTransactionsComponent implements OnInit {

  financialTransactionsListInfo: FinancialTransactionsModel[];
  searchText: '';
  pageSize = 5;
  count: number;

  constructor(private blockService: BlockService, private route: ActivatedRoute,
    private router: Router) { 
      this.financialTransactionsListInfo = [];
    }

  ngOnInit() {
    this.getFinancialTransList();
  }

  getFinancialTransList(newPage?) {
    //if (newPage) {
      this.blockService.getfinancialTransactionsListInfo(newPage, this.pageSize, this.searchText).subscribe((infoList) => {
        this.financialTransactionsListInfo = infoList;
      });
    //}
  }

  valueChange() {
    //this.errorMessage = undefined;
  }

}
