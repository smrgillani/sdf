export class FinancialTransactionsModel {
    constructor() {
        this.data = new TransactionInfo();
    }
    _id: number;
	_userid: number;
	_transaction_no: string;
	data: TransactionInfo; 
	_reference_no: string;
}

export class TransactionInfo {
    user_name: string;
	amount: string;
	project: string;
	account_id: string;
	mode: string;
	status: string;
	create_datetime: Date;
	is_external: string;
	remark: string;
	bank_account: string;
}
