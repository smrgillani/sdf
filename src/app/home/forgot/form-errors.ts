import {CommonErrors} from 'app/elements/validation/form-errors';

export class ForgotErrors extends CommonErrors {
  constructor(){super(name);}
  otp = 'OTP is Invalid.';
  answer='Answer is wrong.';
  user_name='This username has not been registered.';
  email='This email has not been registered.';
  new_password2='New Password and Confirm Password should be same.';
  non_field_errors = 'Unable to log in with provided credentials.';
}
