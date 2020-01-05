import { Component, OnInit } from '@angular/core';
import {PaginationMethods} from 'app/elements/pagination/paginationMethods';
import { FormsModule } from '@angular/forms';
import {SelectItem} from 'primeng/primeng';
import {Transaction} from 'app/core/models/transactionCount';
import { TransactionService } from 'app/common/services/transaction.service';
import { CompletePendingTransModel } from 'app/common/models/complete-pending-trans-model';

@Component({
  selector: 'app-trade-completed-transactions',
  templateUrl: './trade-completed-transactions.component.html',
  styleUrls: ['./trade-completed-transactions.component.scss'],
  providers: [PaginationMethods]
})
export class TradeCompletedTransactionsComponent implements OnInit {
  searchText: '';
  pageSize = 5;
  count: number;
  transactionCount: SelectItem[];
  getTransaction: Transaction;
  completeTransInfoList: CompletePendingTransModel[];

  constructor(private paginationMethods: PaginationMethods,
    private transactionService: TransactionService
  ){
    this.getTransaction = new Transaction();
    this.completeTransInfoList = [];
  }

  ngOnInit() {
    this.transactionCount = this.getTransaction.transactions.map(x => Object.assign({}, x));
  }
  
  valueChange()
  {
      if(this.searchText.length>2 || this.searchText=='')
      {
        this.getCompleteTransList(1);
      }
  }

  getCompleteTransList(newPage) {
     if (newPage) {
       this.transactionService.getCompleteTransList(newPage, this.pageSize,this.searchText)
       .subscribe((infoList) => {
           this.completeTransInfoList = infoList['results'];
           this.count = infoList['count'];
         });
     }
   }
}
