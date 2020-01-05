export default class LaunchModel {
    id: number;
    launch: number;
    fund_amount: {amount:number, currency:string};
    percentage: number;
    due_date:any;
    price_per_share:{amount:number, currency:string};
  }