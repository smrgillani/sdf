import {EmployeeBasicInfo} from './employee-basic-info';
import {EmployeeProfessionalInfo,ListingData} from './employee-professional-info';
import {EmployeeEmploymentInfo} from './employee-employment-info';
import {EmployeeWorkSampleInfo} from './employee-work-sample-info';
import {EmployeeAvailabilityInfo} from './employee-availability-info';
//import {EmployeeContactInfo} from './employee-contact-info';

export class Index {
    constructor(){    
    }
    id: number;
    basicInfo:EmployeeBasicInfo;
    professionalInfo:EmployeeProfessionalInfo[] = [];
    employmentInfo:EmployeeEmploymentInfo[] = [];
    worksampleInfo:EmployeeWorkSampleInfo[] = [];
    availabilityInfo:EmployeeAvailabilityInfo;
   // employeeContactInfo:EmployeeContactInfo;
}
