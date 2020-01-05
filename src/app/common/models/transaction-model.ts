export class TransactionModel {
  id: number;
  user: number;
  bank_account: number;
  reference_no: string;
  create_datetime: Date;
  amount: TransactionAmountInfo;
  remark: string;
  mode: string;
  account_no: string;
  status: string;
  is_external: boolean;
  role: string;
  account_type: string;
  authorization: string;
  next_user: number;
  type: string;
  user_to_user: boolean;
  wallet: string;
  project: number;

  constructor() {
    this.amount = new TransactionAmountInfo();
  }
}

export class TransactionAmountInfo {
  amount?: number;
  currency: string;
}
