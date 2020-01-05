export class InterestPayModel {
    id: number;
    backer_fund: number;
    from_date: Date;
    to_date: Date;
    amount_to_pay: CurrencyAmount;    
    interest_rate: number;
    is_closed: boolean;
}

export class CurrencyAmount {
    currency: string;
    amount: number;
}
