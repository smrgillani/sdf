import RegistrationAnswer from './RegistrationAnswer';

export default class RegistrationQuestion {
  id: number;
  title: string;
  subtitle: string;
  registration_type:number;
  question_type: string;
  answer?: RegistrationAnswer;
  values?: string[];
  vals?:{id:number,value:string,checked:boolean}[];
  is_private?: boolean;
  options?: any;
  group: string;
  order: number;
  model?:string;
  option_list?:any;
}