export class MyProfileModel
{
    id: number;
    basic_details:BasicDetails;
    professional_details: ProfessionalDetails;
    employment_details:EmploymentDetails;
    work_details :WorkDetails;
    availability_details:AvailabilityDetails;
    contact_details:ContactDetails;
}

export class EmploymentDetails
{
        id: number;
        current_employer: string;
        date_start: string;
        date_end: string;
        current_designation: string;
        functional_areas: [
            3
        ];
        role: [
            3
        ];
        departments: [
            3
        ];
        job_role: string;
        key_skills: string;
        previous_employer:string ;
        userprofile_id: number;
        is_completed: boolean;
}

export class BasicDetails
{
    id: number; 
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    marital_status: string;
    employee_status: string;
    interests: string;
    hobbies: string;
    userprofile_id: number;
    is_completed: boolean; //false
}
export class ProfessionalDetails
{
            id: number;
            resume: null;
            highest_qualification: [
                1
            ];
            high_school: 3;
            expertise: [
                1,
                3
            ];
            role: [
                1
            ];
            departments: [
                1
            ];
            total_experience: 1;
            key_skills: string;
            hourly_charges: 1;
            userprofile_id: 26;
            is_completed: false
}

export class WorkDetails
    {
        id: number;
        client: string;
        project_title: string;
        start_month: string;
        start_year: string;
        end_month: string;
        end_year: string;
        project_location: string;
        role: string[];
        employment_type: string;
        project_details: string;
        role_description: string;
        team_size: string;
        skill_used: string;
        userprofile_id: number;
        is_completed: boolean;
    }

    export class AvailabilityDetails
    {
        id: number;
        days_per_year: null;
        hours_per_day: 5;
        userprofile_id: number;
        is_completed: boolean
    }

    export class ContactDetails
    {
        id: number;
        address_line1: string;
        address_line2: string;
        city: string;
        state: string;
        country: string;
        pin_code: string;
        contact_details: string;
        alternate_contact_details: string;
        userprofile_id: number;
        is_completed: boolean;
    }