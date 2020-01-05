export class TradingInfo {
  id: number;
  title: string;
  change: string;
  date: string;
  last_price: number;
  prev_high: number;
  prev_low: number;
  volume: number;
  prices: any[];

  getInitailTitle() {
    return this.title ? this.title[0] : '?';
  }
}

export class AskBidInfo {
  exchange_type: string;
  order_time: Date;
  project: number;
  quantity: number;
  price: number;
  order_type: string;
  limit_price: number;
  bid_by: number;
  ask_by: number;
}

export class ProjectLaunchingSoonInfo {
  id: number;
  title: string;
  cost: string;
  stake_percentage: string;
  shares: string;
}

export class AskBidListInfo {
  price: string;
  quantity: number;
  total: string;
}

export class MyShareInfo {
  project_id: number;
  amount: string;
  due_on: string;
  fund_type: string;
  funded_by: string;
  funded_on: string;//might be Date field
  funded_to: string;
  output: string;
}

export class MyHoldingInfo {
  create_date: string;//might be Date field
  last_price: string;
  percentage: number;
  prev_high: string;
  prev_low: string;
  price_per_share: string;
  project_id: number;
  project_title: string;
  quantity: number;
}

export class SimpleProjectInfo {
  project_id: number;
  project_title: string;
  fund_type: string;
  amount: string;
  stake_percentage: number;
}

export class StockHistoryInfo {
  date: string;
  quantity: number;
  order: string;
  value: string;
  total: string;
}
