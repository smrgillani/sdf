import {UserProfile} from 'app/core/interfaces';
import Roles from './Roles.enum';
import Country from './Country';


export default class UserProfileModel implements UserProfile {
    public id: number;
    public user?: string;
    public first_name: string;
    public last_name: string;
    public phone_number?: string;
    public photo?: string;
    public photo_bounds?: object;
    public photo_crop?: string;
    public address: string;
    public passport_photo?: string;
    public driver_license_photo?: string;
    public driver_license_back_photo?: string;
    public email?: string;
    public role: Roles;
    public user_name? :string;
    public security_question?:number;
    public password?:string;
    public zip?:string;
    public ssn?:number;
    public temp_password?:string;
    public date_of_birth?: Date;
    public is_passportverify: boolean = false;
    public is_dlverify: boolean = false;
    public is_2FA_Email:boolean = false;
    public is_2FA_Phone:boolean = false;
    public is_social_login: boolean = false;
    public is_kyc_complete: boolean = false;
    public registration_country?: Country;
    // public city?:string;
    // public state?:string;
    // public country?:string;
}
