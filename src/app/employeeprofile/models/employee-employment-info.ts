import {SelectItem} from 'app/employeeprofile/models/employee-professional-info';

export class EmployeeEmploymentInfo {
    id: number;
    tempId:number;
    current_employer: string; //this has been taken as employer
    date_start: Date;
    date_end?: Date;
    current_designation: string;
    functional_areas: SelectItem[];
    role: SelectItem[];
    departments: SelectItem[];
    job_role: string;    
    present:boolean=false;
    //previous_employer: PreviousEmployer[];   
    is_completed:boolean;
    functional_areas_name:string[]=[];
    departments_name:string[]=[];
    role_name:string[]=[];
    duration:string;
}


// export class PreviousEmployer
// {
//     id:number;
//     tempId:number;
//     previous_employer:string;
//     date_start:Date;
//     date_end:Date;
//     key_skills:string;
// }