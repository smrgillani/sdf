import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, NgForm } from "@angular/forms";
import ProjectFundingModel from "app/projects/models/ProjectFundingModel";
import { CustomValidators } from "app/core/custom-form-validator";
import { ProjectsService } from "app/projects/projects.service";
import CompanyRoleModel from "../../../../../projects/models/CompanyRoleModel";
import { ConfirmationService } from 'primeng/primeng';
import CompanySharesModel from "../../../../../projects/models/CompanySharesModel";

@Component({
    selector:'app-founder-split-equity',
    templateUrl:'./split-equity.component.html',
    styleUrls:['../funding-type.component.scss']
})
export class FounderProjectSplitEquityFunding implements OnInit{
    @Input() fundData: ProjectFundingModel;
    @Input() showNextButton: boolean = false;
    @Input() nextButtonText:string = "Next";
    @Output() onNext = new EventEmitter();

    isCollapsesplit:boolean = true;

    frmFundDetails: FormGroup;
    amount: FormControl;
    role: FormControl;
    percentage: FormControl;

    roles: { label: string, value: { id: number, title: string } }[] = [];
    companyRoles: CompanyRoleModel[];
    editIndex: number;

    constructor(
        private fb: FormBuilder,
        private confirmationService: ConfirmationService,
        private projectsService: ProjectsService
    ) {
        this.amount = new FormControl('', [Validators.required, CustomValidators.numeric]);
        this.role = new FormControl('', Validators.required);
        this.percentage = new FormControl('', [Validators.required, CustomValidators.numeric]);

        this.frmFundDetails = fb.group({
            amount: this.amount,
            role: this.role,
            percentage: this.percentage,
        });
    }

    ngOnInit() {
        this.projectsService.getCompanyRoles().subscribe((data) => {
            this.companyRoles = data;
            this.manageRoles();
        });
    }

    manageRoles() {
        this.roles = [];
        this.companyRoles.forEach((item) => {
            if (this.fundData.company_shares === undefined || this.fundData.company_shares.find(f => f.role == item.id) === undefined) {
                this.roles.push({ label: item.title, value: { id: item.id, title: item.title } });
            }
        });
    }

    editData(index: number) {
        this.editIndex = index;
        this.manageRoles();
        let data = this.fundData.company_shares[index];
        this.roles.push({ label: data.roleString, value: { id: data.role, title: data.roleString } });
        this.frmFundDetails.patchValue({ 'amount': data.amount.amount, 'role': { id: data.role, title: data.roleString }, 'percentage': data.percentage });
    }

    confirm(index: number) {
        this.fundData.company_shares.splice(index, 1);
        if (index === this.editIndex) {
            this.editIndex = null;
        }
        this.manageRoles();
        // this.confirmationService.confirm({
        //     message: 'Are you sure that you want to delete this record?',
        //     accept: () => {
        //         //Actual logic to perform a confirmation
        //         this.fundData.company_shares.splice(index,1);
        //         if(index===this.editIndex){
        //             this.editIndex = null;
        //         }
        //     }
        // });
    }

    addMore(goNext: boolean) {
        if (this.frmFundDetails.valid) {
            if (this.editIndex != null && this.editIndex != undefined) {
                this.fundData.company_shares[this.editIndex].amount.amount = this.amount.value;
                this.fundData.company_shares[this.editIndex].percentage = this.percentage.value;
                this.fundData.company_shares[this.editIndex].role = this.role.value.id;
                this.fundData.company_shares[this.editIndex].roleString = this.role.value.title;
            }
            else {
                let data: CompanySharesModel = {
                    amount: { currency: 'USD', amount: this.amount.value },
                    percentage: this.percentage.value,
                    role: this.role.value.id,
                    roleString: this.role.value.title,
                    buy:null,
                    sold:null
                };

                if (!this.fundData.company_shares) {
                    this.fundData.company_shares = [];
                }

                this.fundData.company_shares.push(data);
            }
            this.editIndex = null;
            this.resetForm();
            if (goNext === true) {
                this.onNext.emit();
            }
        }
        else {
            this.validateAllFormFields(this.frmFundDetails);
        }
    }

    resetForm() {
        this.manageRoles();
        this.frmFundDetails.reset();
    }

    next() {
        if (
            (this.amount.value !== '' && this.amount.value != null) 
            || (this.percentage.value !== '' && this.percentage.value != null)
            || this.fundData.company_shares==undefined
            || this.fundData.company_shares.length==0) {
            this.addMore(true);
        }
        else {
            this.onNext.emit();
        }
    }
    togglecollapse(togglediv){
        if(!this.showNextButton){       
            togglediv=!togglediv;            
        }
        return togglediv;
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

    getFormIsValid() {
        if (
            this.fundData.company_shares!=undefined 
            && this.fundData.company_shares.length>0
            && (this.amount.value === '' || this.amount.value == null) 
            && (this.percentage.value === '' || this.percentage.value == null)) {
            return true;
        }
        else{
            this.validateAllFormFields(this.frmFundDetails);
            return this.frmFundDetails.valid;
        }
    }
}