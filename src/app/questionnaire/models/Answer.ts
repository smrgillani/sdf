export default class Answer {
  id?: number;
  question: number;
  response_text?: string;
  image?: string;
  diagram?: string;
  spreadsheet?: string;
  powerpoint?: string;
  is_private = false;
  radio?: number;
  multilist?: string[] = [];
  boolean_text?: boolean;
  selected_radio?: number; // This is a work around to get the value of selected radio from api
  date?: any;
  model?: string;
  option_id?: number;
  swot_answer?: { 'strength': string[], 'weakness': string[], 'opportunity': string[], 'threat': string[] };
  ocr?: string;
  productcompare_answer?: any;
  answer_type?: string;
}
