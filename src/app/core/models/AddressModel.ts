export default class AddressModel {
  country: string;
  state: string;
  city: string;
  street: string;
  house: string;
  zip_code: number;

  constructor(street = '') {
    this.country = 'Ukraine';
    this.state = 'Test';
    this.city = 'Zhitomir';
    this.street = street;
    this.house = 'Test';
    this.zip_code = 12345;
  }
}
