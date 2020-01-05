export class ScheduleInterviewModel 
{
   interview_date_time?:string;
   owner?:number;
   job?: string=null;
   employee?: string;
   job_application?: string=null;
   project: number;
   status?: string;
   is_direct_hire?: boolean=false;
   job_title:string;
   job_description: string;
}

export class HireEmployeeData
{
    emp_id?:number;
    onDate:string;
    name:string;
    project: number;
    address:string;
    city:string; 
    state:string;
    zip:string;
    workingTitle?:string;
    department?:string;
    tenureStatus?:string;
    duration?:string;
    beginningDate?:Date;
    salaryParameters?:string;
    responsibilities1?:string;
    responsibilities2?:string;
    responsibilities3?:string;
    departmentContribution?:string;
    is_direct_hire: boolean;
    availability: string;
    document_name: string;
    document: string;
    creator_email: string;
}


export class FireEmployeeData
{
    emp_id?:number;
    create_date:string;
    name:string;
    project: number;
    working_title?:string;
    company_name:string;
    address:string;
    city:string; 
    state:string;
    zip:string;
    // role_name?:string;
   
    termination_date?:Date;
    termination_reason1?:string;
    termination_reason2?:string;
    termination_reason3?:string;
    termination_reason4?:string;
    termination_reason5?:string;

    document_name: string;
    document: string;
    creator_email: string;
    
}
// export class AppointmentLetterTemplate
// {        
//     id:number;
//     template:string;        
// }