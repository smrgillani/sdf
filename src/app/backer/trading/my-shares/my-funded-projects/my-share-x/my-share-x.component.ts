import { Component, OnInit } from '@angular/core';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { FormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { TradingService } from 'app/projects/trading.service';
import { MyShareInfo } from 'app/projects/models/trading-model';

@Component({
  selector: 'app-my-share-x',
  templateUrl: './my-share-x.component.html',
  styleUrls: ['./my-share-x.component.scss'],
  providers: [PaginationMethods]
})
export class MyShareXComponent implements OnInit {
  searchText: '';
  pageSize = 5;
  count: number;
  mySharesList: MyShareInfo[] = [];

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
      this.tradingService.getMyShareList(newPage, this.pageSize,this.searchText,'x')
       .subscribe((listInfo:any) => {
           this.mySharesList = listInfo['results'];
           this.count = listInfo['count'];
         });
    }
  }

  downloadMyShares(id) {
    this.tradingService.downloadMyShares(id).subscribe((obj)=>{

      var link = document.createElement('a');
      link.download = "my_shares_x.pdf";

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
