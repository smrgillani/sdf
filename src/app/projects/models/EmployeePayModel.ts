
export default class EmployeePayModel{
    from_date:any;
    to_date:any;
    hourly_rate:number;
    loggedin_hours:string;
    bonus:{currency: string, amount: number};
    deductions:{currency: string, amount: number};
    amount:{currency: string, amount: number};
    project:number;

    constructor(){
        this.amount = {currency: 'USD', amount: null};
        this.bonus = {currency: 'USD', amount: null};
        this.deductions = {currency: 'USD', amount: null};
      }
}