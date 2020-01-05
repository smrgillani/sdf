import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { CustomValidators } from "app/core/custom-form-validator";

import ProjectBackerFundingModel from "app/projects/models/ProjectBackerFundingModel";
import { NgbPopover, NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ChatService } from "app/collaboration/chat.service";

@Component({
    selector:'app-backer-offer-role',
    templateUrl:'./offer-role.component.html',
    styleUrls:['../backer-funding-type.component.scss']
})
export class BackerProjectOfferRoleFunding implements OnInit{
    @Input() fundData : ProjectBackerFundingModel;
    @Input() showActions : boolean = false;
    @Output() onNext = new EventEmitter();

    isCollapse:boolean = true;
    popoverTimerList = {};
    popUpForShowInterestModalRef: NgbModalRef;

    constructor(private chatService: ChatService,
        private modalService: NgbModal
        
    ){

    }

    ngOnInit(){
        if(!this.fundData.company_shares_backer){
            this.fundData.company_shares_backer = [];
        }
        this.fundData.company_shares_backer.forEach((item)=>{
            this.fundData.creatorFundData.company_shares.find(f=>f.role==item.role).buy=true;
        });
    }

    selectToBuy(ev: any, roleId: number) {
        if (ev.target.checked) {
            this.fundData.company_shares_backer.push(this.fundData.creatorFundData.company_shares.find(f=>f.role==roleId));
        }
        else {
            this.fundData.company_shares_backer = this.fundData.company_shares_backer.filter(f=>f.role!==roleId);
        }
    }

    togglecollapse(togglediv){
        if(!this.showActions){       
            togglediv=!togglediv;            
        }
        return togglediv;
    }

    next(){
        this.onNext.emit();
    }

    skip(){
        this.fundData.quantity = null;
        this.onNext.emit();
    }

    getFormIsValid(){
        return true;
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