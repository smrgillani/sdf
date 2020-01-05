import { FormControl, Validators, ValidatorFn } from '@angular/forms';

// setup simple regex for white listed characters
const validCharacters = /[^\s\w,.:&\/()+%'`@-]/;

// create your class that extends the angular validator class
export class CustomValidators extends Validators {

  // create a static method for your validation
  static validateCharacters(control: FormControl) {

    // first check if the control has a value
    if (control.value && control.value.length > 0) {

      // match the control value against the regular expression
      const matches = control.value.match(validCharacters);

      // if there are matches return an object, else return null.
      return matches && matches.length ? { invalid_characters: matches } : null;
    } else {
      return null;
    }
  }

  // Number only validation
  static numeric(control: FormControl) {
    let val = control.value;
    if (val === undefined || val === null || val === '') return null;
    if (!val.toString().match(/^[0-9]+(\.?[0-9]+)?$/)) return { 'invalidNumber': true };
    return null;
  }

  // //Multiple of Number validation
  // static multipleOf(control: FormControl, baseNumber:number) {
  //   let val = control.value;
  //   if (val === undefined || val === null || val === '') return null;

  //   if(val % baseNumber == 0){
  //     return null
  //   }
  //   return { 'invalidNumber': true };
  // }

  // Checkbox ticked validation
  static tickedCheckbox(control: FormControl) {
    let val = control.value;
    console.log(`checkbox value - ${val}`);
    if (val === true) {
      console.log('return null');
      return null;
    }
    else {
      console.log('return untickCheckbox');
      return { 'untickCheckbox': true }
    }
  }
}