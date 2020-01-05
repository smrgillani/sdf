import Answer from './Answer';

export default class Question {
  answer?: Answer;
  group: string;
  is_active: boolean;
  model?: string;
  option_list: any[];
  order: number;
  pk: number;
  question_type: string;
  registration_type?: string;
  stage: string;
  sub_question: any[];
  subtitle: string;
  title: string;
  vals?: { id: number, value: string, checked: boolean }[];
}
