import {CommonErrors} from 'app/elements/validation/form-errors';

export class FirstLastNameErrors extends CommonErrors {
  pattern = 'Alpha characters only';
  constructor(){
    super(name);
  }
  first_name = 'Enter alpha characters name!';
  last_name = 'Enter alpha characters name!';
}
