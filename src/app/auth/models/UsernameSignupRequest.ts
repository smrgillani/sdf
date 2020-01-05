export class UsernameSignupRequest {
    user_name :string;
    password :string;
    //questionType:string;
    //security_question: string;
    security_question:number;
    answer :string[];


    constructor(user_name :string,
        password :string,
        //questionType :string,
       // security_question: string,
       security_question:number,
        answer :string[])
        {
            this.user_name =user_name;
            this.password=password;
            //this.questionType=questionType;
            //this.security_question=security_question;
            this.security_question=security_question;
            this.answer=answer;
        }
}