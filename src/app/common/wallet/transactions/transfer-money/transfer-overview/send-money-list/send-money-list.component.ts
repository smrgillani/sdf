import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { TransactionService } from 'app/common/services/transaction.service';
import { TransactionModel } from 'app/common/models/transaction-model';

@Component({
  selector: 'app-send-money-list',
  templateUrl: './send-money-list.component.html',
  styleUrls: ['./send-money-list.component.scss'],
  providers: [PaginationMethods]
})
export class SendMoneyListComponent implements OnInit, OnDestroy {
  selectedProject: string;
  searchText: '';
  count: number;
  pageSize = 5;
  projectSubscription = new Subscription(); 
  transactionInfoList: TransactionModel[];
  
  constructor(private paginationMethods: PaginationMethods,
    private transactionService: TransactionService) {
    this.transactionInfoList = [];
  }

  ngOnInit() {
    this.projectSubscription = this.transactionService.selectedProjectDataSubcritption.subscribe((info)=>{
        this.selectedProject = info;
        this.getTransferSendList(1);
    });
  }

  ngOnDestroy() {
    this.projectSubscription.unsubscribe();
  }


  valueChange() {
    if (this.searchText.length > 2 || this.searchText == '') {
      this.getTransferSendList(1);
    }

  }

  getTransferSendList(newPage) {
    if (newPage) {
      this.transactionService.getTransferSendList(newPage, this.pageSize, null, this.searchText, this.selectedProject)
        .subscribe((transactionList: any) => {
          this.transactionInfoList = transactionList.transactions['results'];
          this.count = transactionList.transactions['count'];
        });
    }
  }

}
