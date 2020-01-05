import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiService } from 'app/core/api/api.service';

@Injectable()
export class TradingService {

  constructor(
    private api: ApiService,
  ) { }

  /**
   * Get Project Launch trading list for isx, lsx and x
   */
  list(startPage?, pageSize?, search?, tradingType?): Observable<any> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;

      if (tradingType === 'lsx') {
        return this.api.get<any>('trading/launch-project-list/lsx', {offset: offset, limit: pageSize, search: search});
      } else if (tradingType === 'isx') {
        return this.api.get<any>('trading/launch-project-list/isx', {offset: offset, limit: pageSize, search: search});
      } else {
        return this.api.get<any>('trading/launch-project-list/x', {offset: offset, limit: pageSize, search: search});
      }
    }

    return this.api.get<any>('trading/launch-project-list/lsx');
  }

  /**
   * Get Project Launching soon trading list for isx, lsx and x
   */
  projectLaunchingSoonList(startPage?, pageSize?, search?, tradingType?): Observable<any> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;

      return this.api.get<any>(`trading/project-launch-soon/${tradingType}`, {offset: offset, limit: pageSize, search: search});
    }

    return this.api.get<any>('trading/project-launch-soon/lsx');
  }

  /**
   * Get My Share trading list for isx, lsx and x
   */
  getMyShareList(startPage?, pageSize?, search?, tradingType?): Observable<any> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;

      if (tradingType === 'x') {
        return this.api.get<any>(`fund/project-backer-fund/details`, {offset: offset, limit: pageSize, search: search});
      } else {
        return this.api.get<any>(`trading/my-holdings/${tradingType}`, {offset: offset, limit: pageSize, search: search});
      }
    }

    return this.api.get<any>('fund/project-backer-fund/details');
  }

  /**
   * Post Ask data agianst a project
   */
  postAsk(data): Observable<any> {
    return this.api.post(`trading/asking`, data);
  }

  /**
   * Post bid data agianst a project
   */
  postBid(data): Observable<any> {
    return this.api.post(`trading/bidding`, data);
  }

  /**
   * Get Ask trading list for isx, lsx and x
   */
  getAskList(startPage?, pageSize?, search?, id?, tradingType?): Observable<any> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any>(`trading/launch-project-list/${id}/${tradingType}/ask`, {offset: offset, limit: pageSize, search: search});
    }
    return this.api.get<any>(`trading/launch-project-list/${id}/${tradingType}/ask`);
  }

  /**
   * Get Bid trading list for isx, lsx and x
   */
  getBidList(startPage?, pageSize?, search?, id?, tradingType?): Observable<any> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any>(`trading/launch-project-list/${id}/${tradingType}/bid`, {offset: offset, limit: pageSize, search: search});
    }
    return this.api.get<any>(`trading/launch-project-list/${id}/${tradingType}/bid`);
  }

  /**
   * Get Similar Project list for isx, lsx and x
   */
  getSimilarProjectList(startPage?, pageSize?, search?): Observable<any> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any>(`trading/similar-projects`, {offset: offset, limit: pageSize, search: search});
    }
    return this.api.get<any>(`trading/similar-projects`);
  }

  /**
   * Get Stock History list for project
   */
  getStockHistoryList(startPage?, pageSize?, search?, id?, tradingType?): Observable<any> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any>(`trading/launch-project-list/${id}/${tradingType}/stock-history`, {
        offset: offset,
        limit: pageSize,
        search: search,
      });
    }
    return this.api.get<any>(`trading/launch-project-list/${id}/${tradingType}/stock-history`);
  }

  /**
   * Get Trade Details for project
   */
  getTradeDetails(startPage?, pageSize?, search?, id?, tradingType?): Observable<any> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any>(`trading/launch-project-list/${id}/${tradingType}/trade-details`, {
        offset: offset,
        limit: pageSize,
        search: search,
      });
    }
    return this.api.get<any>(`trading/launch-project-list/${id}/${tradingType}/trade-details`);
  }

  /**
   * Get Candle Chart Data for project
   */
  getCandleChartData(id?, day?, tradingType?): Observable<any> {
    return this.api.get<any>(`trading/launch-project-list/${id}/${tradingType}/candle-chart`, {day: day});
  }

  downloadMyShares(id): Observable<any> {
    return this.api.getForFile<any>(`fund/project-backer-fund/${id}/download`);
  }

  downloadMyHoldings(id): Observable<any> {
    return this.api.getForFile<any>(`trading/my-holdings/${id}/download`);
  }

  updateBid(id: number, data: any) {
    return this.api.put(`trading/bidding/${id}`, data);
  }

  updateAsk(id: number, data: any) {
    return this.api.put(`trading/asking/${id}`, data);
  }

  /**
   * Get User company Shares
   */
  getUserCompanyShareList(startPage?, pageSize?, search?): Observable<any> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any>(`trading/user-holding-shares`, {offset: offset, limit: pageSize, search: search});
    }
    return this.api.get<any>(`trading/user-holding-shares`);
  }

}
