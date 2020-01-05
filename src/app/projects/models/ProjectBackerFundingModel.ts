import ProjectFundingModel from "./ProjectFundingModel";
import CompanySharesModel from "./CompanySharesModel";

export default class ProjectBackerFundingModel {
    id: number;
    fund: number;
    quantity: number;
    return_form:string;
    payment_type:string;
    sanction_amount:{currency: string, amount: number};
    loan_amount:{currency: string, amount: number};
    interest_rate:number;
    min_peer_amt:{currency: string, amount: number};
    fund_amount:{currency: string, amount: number};
    company_shares_backer:CompanySharesModel[];

    fund_title:string;
    creatorFundData:ProjectFundingModel;
    isSkipped:boolean;
    buyCompany:boolean;

    constructor(){
      this.loan_amount = {currency: 'USD', amount: null};
      this.sanction_amount = {currency: 'USD', amount: null};
      this.min_peer_amt = {currency: 'USD', amount: null};
      this.fund_amount = {currency: 'USD', amount: null};
      this.creatorFundData = new ProjectFundingModel();
    }
  }