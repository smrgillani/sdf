import { Component, OnInit } from '@angular/core';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { FormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { Transaction } from 'app/core/models/transactionCount';
import { TransactionService } from 'app/common/services/transaction.service';
import { CompletePendingTransModel } from 'app/common/models/complete-pending-trans-model';

@Component({
  selector: 'app-trade-pending-transactions',
  templateUrl: './trade-pending-transactions.component.html',
  styleUrls: ['./trade-pending-transactions.component.scss'],
  providers: [PaginationMethods]
})
export class TradePendingTransactionsComponent implements OnInit {
  searchText: '';
  pageSize = 5;
  count: number;
  transactionCount: SelectItem[];
  getTransaction: Transaction;
  pendingTransInfoList: CompletePendingTransModel[];

  constructor(private paginationMethods: PaginationMethods,
    private transactionService: TransactionService
  ) {
    this.getTransaction = new Transaction();
    this.pendingTransInfoList = [];
  }

  ngOnInit() {
    this.transactionCount = this.getTransaction.transactions.map(x => Object.assign({}, x));
  }
  valueChange() {
    if (this.searchText.length > 2 || this.searchText == '') {
      this.getPendingTransList(1);
    }

  }
  getPendingTransList(newPage) {
    if (newPage) {
      this.transactionService.getPendingTransList(newPage, this.pageSize, this.searchText)
        .subscribe((pendingInfoList) => {
          this.pendingTransInfoList = pendingInfoList['results'];
          this.count = pendingInfoList['count'];
        });
    }
  }
}
