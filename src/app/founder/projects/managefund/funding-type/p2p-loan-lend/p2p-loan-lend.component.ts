import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, NgForm } from "@angular/forms";
import ProjectFundingModel from "app/projects/models/ProjectFundingModel";
import { CustomValidators } from "app/core/custom-form-validator";

@Component({
    selector:'app-founder-p2p-loan-lend',
    templateUrl:'./p2p-loan-lend.component.html',
    styleUrls:['../funding-type.component.scss']
})
export class FounderProjectPToPLoanLendFunding implements OnInit{
    
    @Input() fundData : ProjectFundingModel;
    @Input() showNextButton : boolean = false;
    @Input() nextButtonText:string = "Next";
    @Output() onNext = new EventEmitter();

    isCollapsep2p:boolean = true;
    
    frmFundDetails: FormGroup;
    loan_amount:FormControl;
    min_peer_amt: FormControl;
    payment_type:FormControl;
    interest_rate: FormControl;
    terms_condition:FormControl;

    paymentTypes:{label:string, value:string}[];

    constructor(
        private fb: FormBuilder
    ){
        this.paymentTypes = [
            {label:'Monthly',value:'monthly'},
            {label:'Quarterly',value:'quarterly'},
            {label:'Yearly',value:'yearly'}
          ];

        this.loan_amount = new FormControl('', [Validators.required, CustomValidators.numeric]);
        this.min_peer_amt= new FormControl('', [Validators.required, CustomValidators.numeric]);
        this.payment_type= new FormControl('', Validators.required);
        this.interest_rate= new FormControl('', [Validators.required, CustomValidators.numeric]);
        this.terms_condition= new FormControl('');

        this.frmFundDetails = fb.group({
            loan_amount: this.loan_amount,
            min_peer_amt: this.min_peer_amt,
            payment_type: this.payment_type,
            interest_rate: this.interest_rate,
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