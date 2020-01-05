export class BankAccountModel {
    id: number;
    bank: number;
    bank_name: string;
    account_type: string;
    iban: string;
    account_holder: string;
    branch_identifier: string;
    branch_address: string;
    currency: string;
    bank_code: string;
    routing_number: number;
    bank_account_no: number;
    is_default: boolean = false;
}
