import { Component, OnInit } from '@angular/core';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { SelectItem } from 'primeng/primeng';
import { Transaction } from 'app/core/models/transactionCount';
import { TransactionService } from 'app/common/services/transaction.service';
import { FundingModel } from 'app/common/models/funding-model';

@Component({
  selector: 'app-funding-details',
  templateUrl: './funding-details.component.html',
  styleUrls: ['./funding-details.component.scss'],
  providers: [PaginationMethods]
})
export class FundingDetailsComponent implements OnInit {
  searchText: '';
  pageSize = 5;
  count: number;
  transactionCount: SelectItem[];
  getTransaction: Transaction;
  fundingInfoList: FundingModel[];

  constructor(private _location: Location,
    private paginationMethods: PaginationMethods,
    private transactionService: TransactionService) {
    this.getTransaction = new Transaction();
    this.fundingInfoList = [];
  }

  ngOnInit() {
    this.transactionCount = this.getTransaction.transactions.map(x => Object.assign({}, x));
  }
  valueChange() {
    if (this.searchText.length > 2 || this.searchText == '') {
      this.getFundingDetailsList(1);
    }

  }

  getFundingDetailsList(newPage) {
    if (newPage) {
      this.transactionService.getFundingDetailsList(newPage, this.pageSize, this.searchText)
        .subscribe((fundList) => {
          this.fundingInfoList = fundList['results'];
          this.count = fundList['count'];
        });
    }
  }
}
