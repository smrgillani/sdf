import { CurrencyAmount } from "./interest-pay-model";

export class LoanCloseModel {
    id: number;
    fund: number;
    backer: number;
    backer_name: string;
    quantity?: number;
    return_form: string;
    payment_type: string;
    sanction_amount: CurrencyAmount;
    loan_amount: CurrencyAmount;
    interest_rate: number;
    min_peer_amt: CurrencyAmount;
    company_shares_backer: any[];
    create_date: Date;
    is_closed: boolean;
}
