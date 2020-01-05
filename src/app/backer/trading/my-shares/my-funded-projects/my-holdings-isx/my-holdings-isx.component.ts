import { Component, OnInit } from '@angular/core';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { FormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { TradingService } from 'app/projects/trading.service';
import { MyHoldingInfo } from 'app/projects/models/trading-model';
@Component({
  selector: 'app-my-holdings-isx',
  templateUrl: './my-holdings-isx.component.html',
  styleUrls: ['./my-holdings-isx.component.scss'],
  providers: [PaginationMethods]
})
export class MyHoldingsIsxComponent implements OnInit {
  searchText: '';
  pageSize = 5;
  count: number;
  myHoldingsList: MyHoldingInfo[] = [];

  constructor(private paginationMethods: PaginationMethods,
    private tradingService: TradingService
  ) {
  }

  ngOnInit() {
  }
  valueChange() {
    if (this.searchText.length > 2 || this.searchText == '') {
      this.getMyShare(1);
    }

  }

  getMyShare(newPage) {
    if (newPage) {
      this.tradingService.getMyShareList(newPage, this.pageSize, this.searchText, 'isx')
        .subscribe((listInfo: any) => {
           this.myHoldingsList = listInfo['results'];
           this.count = listInfo['count'];
        });
    }
  }

  downloadMyHoldings(id) {
    this.tradingService.downloadMyHoldings(id).subscribe((obj)=>{

      var link = document.createElement('a');
      link.download = "my_holdings_isx.pdf";

      const fileReader = new FileReader();
      var blob = new Blob([obj._body], { type: 'contentType' });
      fileReader.readAsDataURL(blob);
      fileReader.onloadend = (event: ProgressEvent) => {
        if (event.target['result']) {
          link.href = event.target['result'];

          link.click();
        }
      };

    }, (errorMsg: any) => {
      console.log(errorMsg);
    });
  }

}
