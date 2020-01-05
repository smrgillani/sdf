import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, NgForm } from "@angular/forms";
import { CustomValidators } from "app/core/custom-form-validator";

import ProjectBackerFundingModel from "app/projects/models/ProjectBackerFundingModel";
import { NgbPopover, NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ChatService } from "../../../../../collaboration/chat.service";

@Component({
    selector: 'app-backer-crowd-normal',
    templateUrl: './crowd-normal.component.html',
    styleUrls: ['../backer-funding-type.component.scss']
})
export class BackerProjectCrowdNormalFunding implements OnInit {
    @Input() fundData: ProjectBackerFundingModel;
    @Input() showActions: boolean = false;
    @Output() onNext = new EventEmitter();

    isCollapse: boolean = true;

    frmFundDetails: FormGroup;
    fund_amount: FormControl;
    popoverTimerList = {};
    popUpForShowInterestModalRef: NgbModalRef;

    constructor(
        private fb: FormBuilder,
        private chatService: ChatService,
        private modalService: NgbModal
    ) {
        this.fund_amount= new FormControl('', [Validators.required, CustomValidators.numeric]);
        this.frmFundDetails = fb.group({
            fund_amount: this.fund_amount
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
        this.fundData.fund_amount = null;
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