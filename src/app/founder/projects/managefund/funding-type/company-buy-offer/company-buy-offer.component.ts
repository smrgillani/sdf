import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, NgForm } from "@angular/forms";
import ProjectFundingModel from "app/projects/models/ProjectFundingModel";
import { CustomValidators } from "app/core/custom-form-validator";

@Component({
    selector:'app-founder-company-buy-offer',
    templateUrl:'./company-buy-offer.component.html',
    styleUrls:['../funding-type.component.scss']
})
export class FounderProjectCompanyBuyOfferFunding implements OnInit{
      
    @Input() fundData : ProjectFundingModel;
    @Input() showNextButton : boolean = false;
    @Input() nextButtonText:string = "Next";
    @Output() onNext = new EventEmitter();

    isCollapsebuy:boolean = true;
    
    frmFundDetails: FormGroup;
    current_valuation:FormControl;
    organization_details:FormControl;
    terms_condition:FormControl;

    constructor(
        private fb: FormBuilder
    ){
        this.current_valuation = new FormControl('', [Validators.required, CustomValidators.numeric]);
        this.organization_details= new FormControl('', Validators.required);
        this.terms_condition= new FormControl('');

        this.frmFundDetails = fb.group({
            current_valuation: this.current_valuation,
            organization_details: this.organization_details,
            terms_condition:this.terms_condition
        });
    }
    
    ngOnInit(){

    }
    togglecollapse(togglediv){
        if(!this.showNextButton){       
            togglediv=!togglediv;            
        }
        return togglediv;
    }
    next(){
        if(this.frmFundDetails.valid){
            this.onNext.emit();
        }
        else{
            this.validateAllFormFields(this.frmFundDetails);
        }
    }

    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }

    getFormIsValid(){
        this.validateAllFormFields(this.frmFundDetails);
        return this.frmFundDetails.valid;
    }
}