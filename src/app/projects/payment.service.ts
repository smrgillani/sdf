import { Injectable } from "@angular/core";
import { ApiService } from 'app/core/api/api.service';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';
import EmployeePaymentDetails from "./models/EmployeePaymentDetails";
import EmployeePayModel from "./models/EmployeePayModel";
import { Headers } from '@angular/http';

@Injectable()
export class PaymentService {
    constructor(private api: ApiService) {

    }

    /**
    * Get current employee payment details on emp id.
    *
    * @returns current employee payment details
    */
    getCurrentEmployeePayDetails(empProfileId: number,projectId:string,startPage?, pageSize?): Observable<EmployeePaymentDetails> {
        let myHeader = new Headers();
        myHeader.append('project', projectId);
        if(!startPage){
            startPage = 0;
        }
        if(!pageSize){
            pageSize = 10;
        }
        const offset = (startPage - 1) * pageSize;
        return this.api.get<EmployeePaymentDetails>(`recruitments/current-employee/${empProfileId}/pay`,{ offset: offset, limit: pageSize},myHeader);
    }

    /**
    * Get logged in hours for a selected date range.
    *
    * @returns logged in hours and amount for a selected date range.
    */
    getLoggedInHours(empProfileId: number, data: EmployeePayModel): Observable<{ amount: number, hours: string }> {
        let req = {
            start_date: moment(data.from_date).format('YYYY-MM-DD'),
            end_date: moment(data.to_date).format('YYYY-MM-DD'),
            hourly_rate: data.hourly_rate,
            project: data.project
        }
        console.log(req);
        return this.api.post(`recruitments/current-employee/${empProfileId}/hours-calculation`, req);
    }

    /**
    * Get logged in hours for a selected date range.
    *
    * @returns logged in hours and amount for a selected date range.
    */
    savePayment(empProfileId: number, data: EmployeePayModel): Observable<any> {       
        let req = {
            project: data.project,
            from_date: moment(data.from_date).format('YYYY-MM-DD'),
            to_date: moment(data.to_date).format('YYYY-MM-DD'),
            loggedin_hours:data.loggedin_hours,
            bonus:data.bonus,
            deductions:data.deductions,
            hourly_rate: data.hourly_rate,
            amount:data.amount
        }
        console.log(req);
        return this.api.post(`recruitments/current-employee/${empProfileId}/pay`, req);
    }

    getEmployeeBonusOrHike(type: string, user: number): Observable<any> {
        return this.api.get(`${type}-requests/${user}/${type}-list`);
    }
}