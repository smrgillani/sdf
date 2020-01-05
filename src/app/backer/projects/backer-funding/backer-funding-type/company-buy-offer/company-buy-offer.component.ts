import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, NgForm } from "@angular/forms";
import { CustomValidators } from "app/core/custom-form-validator";

import ProjectBackerFundingModel from "app/projects/models/ProjectBackerFundingModel";
import { ChatService } from 'app/collaboration/chat.service';
import { NgbPopover, NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-backer-company-buy-offer',
    templateUrl: './company-buy-offer.component.html',
    styleUrls: ['../backer-funding-type.component.scss']
})
export class BackerProjectCompanyBuyOfferFunding implements OnInit {
    @Input() fundData: ProjectBackerFundingModel;
    @Input() showActions: boolean = false;
    @Output() onNext = new EventEmitter();

    isCollapse: boolean = true;

    frmFundDetails: FormGroup;
    buyCompany: FormControl;
    popUpForShowInterestModalRef: NgbModalRef;
    popoverTimerList = {};

    constructor(
        private fb: FormBuilder,
        private chatService: ChatService,
        private modalService: NgbModal
    ) {
        this.buyCompany = new FormControl(false);
        this.frmFundDetails = fb.group({
            buyCompany: this.buyCompany
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

    next() {
        if (this.frmFundDetails.valid) {
            this.onNext.emit();
        }
        else {
            this.validateAllFormFields(this.frmFundDetails);
        }
    }

    skip() {
        this.fundData.buyCompany = null;
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

    showInterest(myShowInterestPopover: NgbPopover) {
        this.chatService.postShowInterest(this.fundData.creatorFundData.id).subscribe(fundInfo => {
            clearTimeout(this.popoverTimerList['timerName']);
            this.popUpForShowInterestModalRef = this.modalService.open(myShowInterestPopover, {backdrop: false});            
            this.popoverTimerList['timerName'] = setTimeout(() => {
                this.popUpForShowInterestModalRef.close();
            }, 2000);
        });
    }
}