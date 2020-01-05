export class PhoneSignupRequest {
  phone: string;
  password: string;

  // constructor(phone: string) {
  constructor(phone: string, password: string) {   
    this.phone = phone;
    this.password = password;
  }
}
