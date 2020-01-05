import EmployeePayModel from "./EmployeePayModel";

export default class EmployeePaymentDetails{
    current_designation:string;
    employee:string;
    hourly_rate:number;
    payment_history:{count:number, next:string, previous:string, results:EmployeePayModel[]};
    photo:string;
    rating:number;
}