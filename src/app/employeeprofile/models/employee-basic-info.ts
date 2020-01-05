import {ListingData} from './employee-professional-info';
import {SelectItem} from 'app/employeeprofile/models/employee-professional-info';

export class EmployeeBasicInfo {
    id: number;
    first_name: string;
    last_name: string;
    photo?: string;
    photo_bounds?: object;
    photo_crop?: string;
    date_of_birth: Date;
    date_of_birth2: Date;
    gender: string;
    marital_status: string;
    interests: string;
    hobbies: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: ListingData;
    country: ListingData;
    pin_code: string;
    contact_details: string;
    alternate_contact_details: string; 
    is_completed: boolean;
    total_experience:SelectItem;
    userprofile_id: number;
    email: string;
}
