import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../services/transaction.service';
import { TransactionModel } from '../../../models/transaction-model';


@Component({
  selector: 'app-pending-transactions',
  templateUrl: './pending-transactions.component.html',
  styleUrls: ['./pending-transactions.component.scss'],
  providers: [PaginationMethods]

})
export class PendingTransactionsComponent implements OnInit, OnChanges {
  @Input() selectedProject;
  searchText: '';
  count: number;
  pageSize = 5;
  transactionInfoList: TransactionModel[];

  constructor(private paginationMethods: PaginationMethods,
    private transactionService: TransactionService
  ) {
    this.transactionInfoList = [];
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    this.getTransactionList(1);
  } 

  valueChange() {
    if (this.searchText.length > 2 || this.searchText == '') {
      this.getTransactionList(1);
    }

  }
  getTransactionList(newPage) {
    if (newPage) {
      this.transactionService.getPendingTransactionList(newPage, this.pageSize, null, this.searchText, this.selectedProject)
        .subscribe((transactionList: any) => {
          this.transactionInfoList = transactionList.transactions['results'];
          this.count = transactionList.transactions['count'];
        });
    }
  }
}
