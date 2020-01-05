export default class CompanySharesModel{
    amount:{currency: string, amount: number};
    percentage:number;
    role:number; 
    roleString:string;

    sold:boolean;

    //Additional field for operations
    buy:boolean;
}