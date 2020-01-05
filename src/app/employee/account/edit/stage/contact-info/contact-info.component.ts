// import { Component, OnInit } from '@angular/core';
// import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms'
// import { StageStorage } from 'app/employeeprofile/stage-storage.service';
// import {EmployeeContactInfo} from 'app/employeeprofile/models/employee-contact-info';
// import {ListingData} from 'app/employeeprofile/models/employee-professional-info';  //'../employeeprofile/models/employee-professional-info';
// import { List } from 'lodash';

// @Component({
//   selector: 'app-contact-info',
//   templateUrl: './contact-info.component.html',
//   styleUrls: ['./contact-info.component.scss']
// })
// export class ContactInfoComponent implements OnInit {
//   complexForm: FormGroup;
//   messages: any;
//   fields = null;
//   private contactInfo:EmployeeContactInfo;
//   countryList:ListingData[];
//   stateList:ListingData[];

//   constructor(fb: FormBuilder, private stageStorage:StageStorage) {
//     this.contactInfo=new EmployeeContactInfo();
//     this.complexForm = fb.group({
//       // To add a validator, we must first convert the string value into an array. The first item in the array is the default value if any, then the next item in the array is the validator. Here we are adding a required validator meaning that the firstName attribute must have a value in it.     
//       'address_line1': [''],
//       'address_line2': [''],      
//       'city': [''],
//       'state': [''],
//       'country': [''],
//       'pin_code': [''],
//       'contact_details':[''],
//       'alternate_contact_details':['']
//     });
//   }

//   ngOnInit() {
//     //get value from.getContactDetails
//     this.stageStorage.getContactDetails().subscribe(
//       (obj: EmployeeContactInfo) => {        
//         console.log('obj');
//         console.log(obj);
//         if(obj!=undefined)
//         {
//           this.contactInfo=obj;  
//           if(this.contactInfo.country!=null){
//               this.getStateList(this.contactInfo.country);
//           }
//         }
//         else{
//           this.contactInfo=new EmployeeContactInfo();
//         }
//         this.setValues();   
//       },
//       (errorMsg: any) => {
//         console.log(errorMsg);
//       }
//     );
    
//     this.stageStorage.getCountryList().subscribe(
//       (obj: ListingData[]) => {        
//         console.log('obj');
//         console.log(obj);
//         this.countryList=obj;     
//       },
//       (errorMsg: any) => {
//         console.log(errorMsg);
//       }
//     );
//   }
//   setValues()
//   {
//     this.complexForm.setValue({
//       'address_line1': this.contactInfo.address_line1,
//       'address_line2': this.contactInfo.address_line2,
//       'city': this.contactInfo.city,
//       'state': this.contactInfo.state,
//       'country': this.contactInfo.country,
//       'pin_code': this.contactInfo.pin_code,
//       'contact_details':this.contactInfo.contact_details,
//       'alternate_contact_details':this.contactInfo.alternate_contact_details
//     })
//   }
//   onStateSelect(_Id)
//   {    
//     for (var i = 0; i < this.stateList.length; i++)
//     {
//       if (this.stateList[i].id == _Id) {
//         this.contactInfo.state=_Id;
//       }
//     }    
//     console.log('this.contactInfo');
//     console.log(this.contactInfo);
//   }

//   onCountrySelect(_Id)
//   {    
//     for (var i = 0; i < this.countryList.length; i++)
//     {
//       if (this.countryList[i].id == _Id) {
//         this.contactInfo.country=_Id;
//       }
//     }
//     this.getStateList( this.contactInfo.country);
//     console.log('this.contactInfo');
//     console.log(this.contactInfo);
//   }

// getStateList(_id)
// {
//   this.stageStorage.getStateList(_id).subscribe(
//     (obj: ListingData[]) => {        
//       console.log('obj');
//       console.log(obj);
//       this.stateList=obj;     
//     },
//     (errorMsg: any) => {
//       console.log(errorMsg);
//     }
//   );
// }
//   submitContactInfo(value: any) {
//     console.log('this.contactInfo');
//     console.log(this.contactInfo);

//     this.contactInfo.address_line1=value.address_line1;
//     this.contactInfo.address_line2=value.address_line2;
//     this.contactInfo.country=value.country;
//     this.contactInfo.state=value.state;
//     this.contactInfo.city=value.city;
//     this.contactInfo.pin_code=value.pin_code;
//     this.contactInfo.contact_details=value.contact_details;
//     this.contactInfo.alternate_contact_details=value.alternate_contact_details;
//     this.contactInfo.is_completed = true;
//     this.stageStorage.putContactInfo(this.contactInfo).subscribe((obj)=>{
//       console.log(obj);
//     }    ,
//     (errorMsg: any) => {
//       console.log(errorMsg);
//     });
//   }
// }
