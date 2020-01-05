import { Component, Input } from '@angular/core';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { TradingService } from 'app/projects/trading.service';
import { TradingInfo } from 'app/projects/models/trading-model';
import { StockInfo } from '../../../../projects/models/candle-chart-model';


@Component({
  selector: 'app-project-launch',
  templateUrl: './project-launch.component.html',
  styleUrls: ['./project-launch.component.scss'],
  providers: [PaginationMethods],
})
export class ProjectLaunchComponent {
  searchText: '';
  count: number;
  pageSize = 5;
  tradingInfoList: TradingInfo[] = [];

  @Input() tradingType: string;

  constructor(
    private paginationMethods: PaginationMethods,
    private tradingService: TradingService,
  ) { }

  valueChange() {
    if (this.searchText.length > 2 || this.searchText === '') {
      this.getTradingList(1);
    }
  }

  getTradingList(newPage) {
    if (newPage) {
      this.tradingService.list(newPage, this.pageSize, this.searchText, this.tradingType)
        .subscribe((infoList: any) => {
          this.tradingInfoList = infoList['results'] as TradingInfo[];
          this.count = infoList['count'];
        });
    }
  }

  filterEmptyValues(data: StockInfo[]) {
    return data.map(item => {
      if (item.volume === 0) {
        item.high = null;
        item.close = null;
        item.low = null;
        item.open = null;
      }

      return item;
    });
  }
}
