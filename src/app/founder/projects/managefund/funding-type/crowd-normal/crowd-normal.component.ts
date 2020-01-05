import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, NgForm } from "@angular/forms";
import ProjectFundingModel from "app/projects/models/ProjectFundingModel";
import { CustomValidators } from "app/core/custom-form-validator";
import { ReturnInForms } from "app/founder/projects/managefund/managefund.constants";

@Component({
    selector:'app-founder-crowd-normal',
    templateUrl:'./crowd-normal.component.html',
    styleUrls:['../funding-type.component.scss']
})
export class FounderProjectCrowdNormalFunding implements OnInit{
    @Input() fundData : ProjectFundingModel;
    @Input() showNextButton : boolean = false;
    @Input() nextButtonText:string = "Next";
    @Input() showReadOnly:boolean = false;
    @Output() onNext = new EventEmitter();

    isCollapsecrowdnormal:boolean = true;
    
    frmFundDetails: FormGroup;
    min_target_offering_amt:FormControl;
    due_by:FormControl;
    //return_form: FormControl;
    //price_security: FormControl;
    terms_condition:FormControl;

    returnInForms:{label:string, value:string}[];

    constructor(
        private fb: FormBuilder
    ){
        this.returnInForms = ReturnInForms;
    }
    
    ngOnInit(){
        this.min_target_offering_amt = new FormControl({value:'', disabled: this.showReadOnly}, [Validators.required, CustomValidators.numeric]);
        this.due_by= new FormControl({value:'', disabled: this.showReadOnly}, Validators.required);
        //this.return_form= new FormControl({value:'', disabled: this.showReadOnly}, Validators.required);
        //this.price_security= new FormControl({value:'', disabled: this.showReadOnly}, [Validators.required, CustomValidators.numeric]);
        this.terms_condition= new FormControl({value:'', disabled: this.showReadOnly});

        this.frmFundDetails = this.fb.group({
            min_target_offering_amt: this.min_target_offering_amt,
            due_by: this.due_by,
            //return_form: this.return_form,
            //price_security: this.price_security,
            terms_condition:this.terms_condition
        });
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