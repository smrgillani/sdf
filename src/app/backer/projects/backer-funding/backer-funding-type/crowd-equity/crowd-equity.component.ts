import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, NgForm } from "@angular/forms";
import { CustomValidators } from "app/core/custom-form-validator";

import ProjectBackerFundingModel from "app/projects/models/ProjectBackerFundingModel";
import { ChatService } from 'app/collaboration/chat.service';
import { NgbPopover, NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-backer-crowd-equity',
    templateUrl: './crowd-equity.component.html',
    styleUrls: ['../backer-funding-type.component.scss']
})
export class BackerProjectCrowdEquityFunding implements OnInit {
    @Input() fundData: ProjectBackerFundingModel;
    @Input() showActions: boolean = false;
    @Output() onNext = new EventEmitter();

    isCollapse: boolean = true;
    isValid: boolean = true;
    minShares: number;

    frmFundDetails: FormGroup;
    quantity: FormControl;
    popUpForShowInterestModalRef: NgbModalRef;
    popoverTimerList = {};

    constructor(
        private fb: FormBuilder,
        private chatService: ChatService,
        private modalService: NgbModal
    ) {
        this.quantity = new FormControl('', [CustomValidators.numeric]);
        this.frmFundDetails = fb.group({
            quantity: this.quantity
        });
    }

    ngOnInit() {

    }

    togglecollapse(togglediv) {
        if (!this.showActions) {
            togglediv = !togglediv;
        }
        return togglediv;
    }

    validateMultiple() {
        let minStakeAmount = (this.fundData.creatorFundData.min_amount_equity/100) * this.fundData.creatorFundData.min_target_offering_amt.amount;
        this.minShares = Math.round(minStakeAmount/this.fundData.creatorFundData.price_security.amount);

        if((this.quantity.value % this.minShares)!=0){
            this.isValid = false;
        }
        else{
            this.isValid = true;
        }
    }

    next() {  
        if (this.frmFundDetails.valid && this.isValid) {
            this.onNext.emit();
        }
        else {
            this.validateAllFormFields(this.frmFundDetails);
        }
    }

    skip() {
        this.fundData.quantity = null;
        this.onNext.emit();
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
        this.validateAllFormFields(this.frmFundDetails);
        return this.frmFundDetails.valid;
    }

    showInterest(template: NgbPopover) {
        this.chatService.postShowInterest(this.fundData.creatorFundData.id).subscribe(fundInfo => {
            this.popUpForShowInterestModalRef = this.modalService.open(template, {backdrop: false});
            clearTimeout(this.popoverTimerList['timerName']);
            this.popoverTimerList['timerName'] = setTimeout(() => {
                this.popUpForShowInterestModalRef.close();
            }, 2000);
        });
    }
}