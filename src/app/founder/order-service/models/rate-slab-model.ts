import { TransactionAmountInfo } from "app/common/models/transaction-model";

export class RateSlabModel {
    charge_amount: TransactionAmountInfo;
    charge_amount_currency: string;
    commission: number;
    complexity: {
        id:number;
        title: string;
    };
    id: number;
    total_amount: TransactionAmountInfo;
    fee: TransactionAmountInfo;
    expertise: string;
    total_amount_currency: string;
    word_limit: {
        id:number;
        title: string;
    };
    extensiveness: {
        id:number;
        title: string;
    };
    subject: {
        id:number;
        title: string;
    };
    urgency: {
        id:number;
        title: string;
    };
}
