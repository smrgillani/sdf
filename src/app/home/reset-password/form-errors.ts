import {CommonErrors} from 'app/elements/validation/form-errors';

export class ResetErrors extends CommonErrors {
  constructor(){super(name);}      
  password_too_short='This password is too short. It must contain at least 6 characters';
  new_password2='New Password and Confirm Password should be same.';
  password_too_similar='The password is too similar to the username.';
  non_field_errors = 'Unable to proceed with provided passwords.';
}
