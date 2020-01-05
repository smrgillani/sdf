import { Component, OnInit } from '@angular/core';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { TradingService } from 'app/projects/trading.service';

@Component({
  selector: 'app-holding-shares',
  templateUrl: './holding-shares.component.html',
  styleUrls: ['./holding-shares.component.scss'],
  providers: [PaginationMethods]
})
export class HoldingSharesComponent implements OnInit {

  searchText: '';
  pageSize = 5;
  count: number;
  myHoldingsShareList = [];

  constructor(private paginationMethods: PaginationMethods,
    private tradingService: TradingService
  ) {
  }

  ngOnInit() {
  }
  valueChange() {
    if (this.searchText.length > 2 || this.searchText == '') {
      this.getMyShareList(1);
    }

  }

  getMyShareList(newPage) {
    if (newPage) {
      this.tradingService.getUserCompanyShareList(newPage, this.pageSize, this.searchText)
        .subscribe((listInfo: any) => {
           this.myHoldingsShareList = listInfo['results'];
           this.count = listInfo['count'];
        });
    }
  }

}
