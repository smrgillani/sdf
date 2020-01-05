import {CommonErrors} from 'app/elements/validation/form-errors';

export class LoginErrors extends CommonErrors {
  constructor(){super(name);}
  non_field_errors = 'The password that you have entered is incorrect';
  otp = 'OTP is invalid.'
}
