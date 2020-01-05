import {CommonErrors} from 'app/elements/validation/form-errors';

export class EmployeeErrors extends CommonErrors {
  constructor(){super(name);}
  non_field_errors = 'Unable to log in with provided credentials.';
  contact_details = 'The phone number entered is not valid.';
  alternate_contact_details = 'The phone number entered is not valid.';
  date_of_birth='Future date is not allowed';
}