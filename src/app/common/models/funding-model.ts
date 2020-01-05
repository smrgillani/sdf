export class FundingModel {
    id: number;
    project_id: number;
    fund_type: string;
    funded_to: string;
    funded_by: string;
    amount: string;
    output: string;
    funded_on: string;
    due_on: string;
    is_loan_type: boolean;
    having_open_interest: boolean;
    is_closed: boolean;
}
