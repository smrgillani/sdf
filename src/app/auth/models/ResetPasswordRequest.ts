export class ResetPasswordRequest{
    email?:string;
    phone?:string;
    otp?:string;
    user_name?:string;
    security_question?:number;
    answer?:string[];
}