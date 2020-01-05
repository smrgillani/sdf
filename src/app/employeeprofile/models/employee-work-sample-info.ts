//import {ListingData} from 'app/employeeprofile/models/employee-professional-info';  //'../employeeprofile/models/employee-professional-info';
import {SelectItem} from 'app/employeeprofile/models/employee-professional-info';

export class EmployeeWorkSampleInfo {
    tempId?:number;
    id?: number;
    client: string;
    project_title: string;
    from_date:Date;
    to_date:Date;
    project_location: string;
    is_onsite: boolean;
    role: SelectItem[];
    employment_type: string;
    project_details: string;
    role_description: string;
    team_size: string;
    skill_used: string;
    is_completed: boolean;
}

