
export default class RegistrationPackageModel{
    id: number;
    title:string;
    registration_type:number;
    is_active:boolean;
    description:string;
    amount:number;
    features:{id:number,feature_id:number, feature:string,feature_value_type:string,is_available:boolean,value:any}[];
}