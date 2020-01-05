
export  class HireEmployeeModel {
    id: number;
    first_name: string;
    last_name: string;
    current_designation: string;
    availability_details: AvailabilityDetails;
    experience: string;  
   // hourlycharges:string; 
    create_date?:string;
    job?: string=null;
    job_title: string;
    status:string;
    job_application_status: string;
  }
  export  class AvailabilityDetails {
    id: number;
    days_per_year: string;
    hours_per_day: string;
    userprofile_id: number;
    hourly_charges: string;
  }
 