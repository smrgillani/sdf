import CompanySharesModel from "./CompanySharesModel";

export default class ProjectFundingModel {
    id: number;
    project: number;
    fund: number;
    quantity: number;
    amount:{currency: string, amount: number};
    min_target_offering_amt:{currency: string, amount: number};
    amount_equity:number;
    min_amount_equity:number;
    due_by:any;
    return_form:string;
    price_security:{currency: string, amount: number};
    payment_type:string;
    loan_amount:{currency: string, amount: number};
    interest_rate:number;
    sanction_amount:{currency: string, amount: number};
    min_peer_amt:{currency: string, amount: number};
    current_valuation:{currency: string, amount: number};
    fund_amount:{currency: string, amount: number};
    organization_details:string;
    company_shares:CompanySharesModel[];
    terms_condition:string;

    sold:boolean;

    fund_title:string;

    constructor(){
      this.amount = {currency: 'USD', amount: null};
      this.min_target_offering_amt = {currency: 'USD', amount: null};
      this.price_security = {currency: 'USD', amount: null};
      this.loan_amount = {currency: 'USD', amount: null};
      this.sanction_amount = {currency: 'USD', amount: null};
      this.min_peer_amt = {currency: 'USD', amount: null};
      this.current_valuation = {currency: 'USD', amount: null};
      this.fund_amount = {currency: 'USD', amount: null};
    }
  }