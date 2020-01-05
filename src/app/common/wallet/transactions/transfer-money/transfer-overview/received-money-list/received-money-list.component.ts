import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { TransactionModel } from 'app/common/models/transaction-model';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { TransactionService } from 'app/common/services/transaction.service';

@Component({
  selector: 'app-received-money-list',
  templateUrl: './received-money-list.component.html',
  styleUrls: ['./received-money-list.component.scss'],
  providers: [PaginationMethods]
})
export class ReceivedMoneyListComponent implements OnInit {
  selectedProject: string;
  searchText: '';
  count: number;
  pageSize = 5;
  transactionInfoList: TransactionModel[];
  projectSubscription = new Subscription();
  
  constructor(private paginationMethods: PaginationMethods,
    private transactionService: TransactionService) {
    this.transactionInfoList = [];
  }

  ngOnInit() {
    this.projectSubscription = this.transactionService.selectedProjectDataSubcritption.subscribe((info)=>{
        this.selectedProject = info;
        this.getTransferReceivedList(1);
    });
  }

  ngOnDestroy() {
    this.projectSubscription.unsubscribe();
  }

  valueChange() {
    if (this.searchText.length > 2 || this.searchText == '') {
      this.getTransferReceivedList(1);
    }

  }

  getTransferReceivedList(newPage) {
    if (newPage) {
      this.transactionService.getTransferReceivedList(newPage, this.pageSize, null, this.searchText, this.selectedProject)
        .subscribe((transactionList: any) => {
          this.transactionInfoList = transactionList.transactions['results'];
          this.count = transactionList.transactions['count'];
        });
    }
  }

}
