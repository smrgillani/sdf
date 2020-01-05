export class CandleChartModel {
  id: number;
  title: string;
  stock_info: StockInfo[];

  constructor() {
    this.stock_info = [];
  }
}

export class StockInfo {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
}
