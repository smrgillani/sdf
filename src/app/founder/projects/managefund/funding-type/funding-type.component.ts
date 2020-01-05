import { OnInit, Component, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormControl, Validators, FormBuilder, NgForm } from "@angular/forms";
import { ProjectsService } from "app/projects/projects.service";
import ProjectFundingModel from "../../../../projects/models/ProjectFundingModel";
import { FounderProjectCrowdEquityFunding } from "app/founder/projects/managefund/funding-type/crowd-equity/crowd-equity.component";
import { FounderProjectCompanyBuyOfferFunding } from "./company-buy-offer/company-buy-offer.component";
import { FounderProjectCrowdNormalFunding } from "./crowd-normal/crowd-normal.component";
import { FounderProjectLoanServiceFunding } from "./loan-service/loan-service.component";
import { FounderProjectOfferRoleFunding } from "./offer-role/offer-role.component";
import { FounderProjectPToPLoanLendFunding } from "./p2p-loan-lend/p2p-loan-lend.component";
import { FounderProjectSplitEquityFunding } from "./split-equity/split-equity.component";
import FundTypes from "app/projects/fundtypes.enum";

@Component({
    templateUrl: './funding-type.component.html',
    styleUrls: ['./funding-type.component.scss']
})
export class FounderProjectFundingTypeComponent implements OnInit {
    fundTypes = FundTypes;
    selectedFundTypes: { projectId: number, fundType: ProjectFundingModel }[];
    projectId: number;
    selectedFundTypeCount: number;
    currentFundTypeIndex: number;
    currentFund: ProjectFundingModel = new ProjectFundingModel();
    serverSideErrors:any;

    showSummary: boolean = false;

    @ViewChild(FounderProjectCrowdEquityFunding) childCrowdEquity;
    @ViewChild(FounderProjectCompanyBuyOfferFunding) childCompanyBuyOffer;
    @ViewChild(FounderProjectCrowdNormalFunding) childCrowdNormal;
    @ViewChild(FounderProjectLoanServiceFunding) childLoanService;
    @ViewChild(FounderProjectOfferRoleFunding) childOfferRole;
    @ViewChild(FounderProjectPToPLoanLendFunding) childP2P;
    @ViewChild(FounderProjectSplitEquityFunding) childSplitEquity;

    crowdEquityStatus: boolean;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private projectsService: ProjectsService
    ) {

    }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.projectId = params['id'];
            this.selectedFundTypes = this.projectsService.getSelectedFundToProceed(this.projectId);
            if (!this.selectedFundTypes || this.selectedFundTypes.length == 0) {
                this.router.navigate([`/founder/projects/${this.projectId}/managefund`]);
            }
            else {
                this.selectedFundTypeCount = this.selectedFundTypes.length;
                this.currentFundTypeIndex = 0;
                this.loadCurrentFundType();
            }
        });
    }

    ngAfterViewInit() {
        //this.crowdEquityStatus = this.child.frmFundDetails.valid;
    }

    goBack() {
        if (this.currentFundTypeIndex == 0) {
            this.router.navigate([`/founder/projects/${this.projectId}/managefund`]);
        }
        else {
            this.currentFundTypeIndex--;
            this.showSummary = false;
            this.loadCurrentFundType();
        }
    }

    onNext() {
        console.log(this.selectedFundTypes[this.currentFundTypeIndex].fundType);
        if (this.currentFundTypeIndex == this.selectedFundTypeCount - 1) {
            console.log('all fund types done');
            this.showSummary = true;
        }
        else {
            this.currentFundTypeIndex++;
            this.loadCurrentFundType();
        }
    }

    loadCurrentFundType() {
        this.currentFund = this.selectedFundTypes[this.currentFundTypeIndex].fundType;
        console.log(this.currentFund);
    }

    submitFundingTypes() {
        let isValidEntries: { fundType: number, fundTitle: string, valid: boolean }[] = [];
        this.selectedFundTypes.forEach((item) => {
            switch (item.fundType.fund) {
                case this.fundTypes.CrowdFunding:
                    isValidEntries.push({ fundType: item.fundType.fund, fundTitle: item.fundType.fund_title, valid: this.childCrowdEquity.getFormIsValid() });
                    break;
                case this.fundTypes.DebtFinancing:
                    isValidEntries.push({ fundType: item.fundType.fund, fundTitle: item.fundType.fund_title, valid: false });
                    break;
                case this.fundTypes.LoanServices:
                    isValidEntries.push({ fundType: item.fundType.fund, fundTitle: item.fundType.fund_title, valid: this.childLoanService.getFormIsValid() });
                    break;
                case this.fundTypes.NormalCrowdFunding:
                    isValidEntries.push({ fundType: item.fundType.fund, fundTitle: item.fundType.fund_title, valid: this.childCrowdNormal.getFormIsValid() });
                    break;
                case this.fundTypes.P2PLoan:
                    isValidEntries.push({ fundType: item.fundType.fund, fundTitle: item.fundType.fund_title, valid: this.childP2P.getFormIsValid() });
                    break;
                case this.fundTypes.CompanyBuyOffer:
                    isValidEntries.push({ fundType: item.fundType.fund, fundTitle: item.fundType.fund_title, valid: this.childCompanyBuyOffer.getFormIsValid() });
                    break;
                case this.fundTypes.OfferBuyRole:
                    isValidEntries.push({ fundType: item.fundType.fund, fundTitle: item.fundType.fund_title, valid: this.childOfferRole.getFormIsValid() });
                    break;
                case this.fundTypes.SplitEquity:
                    isValidEntries.push({ fundType: item.fundType.fund, fundTitle: item.fundType.fund_title, valid: this.childSplitEquity.getFormIsValid() });
                    break;
                case 9:
                    isValidEntries.push({ fundType: item.fundType.fund, fundTitle: item.fundType.fund_title, valid: false });
                    break;
                default:
                    isValidEntries.push({ fundType: item.fundType.fund, fundTitle: item.fundType.fund_title, valid: false });
                    break;
            }
        });

        if (isValidEntries.find(d => d.valid === false)) {
            console.log('Please review again');
            return;
        }
        else {
            console.log('You are good to submit funding types');
            let data: ProjectFundingModel[] = [];
            this.selectedFundTypes.forEach((item) => {
                if (item.fundType.amount != null && item.fundType.amount.amount == null) {
                    item.fundType.amount = null;
                }
                if (item.fundType.min_target_offering_amt != null && item.fundType.min_target_offering_amt.amount == null) {
                    item.fundType.min_target_offering_amt = null;
                }
                if (item.fundType.price_security != null && item.fundType.price_security.amount == null) {
                    item.fundType.price_security = null;
                }
                if (item.fundType.loan_amount != null && item.fundType.loan_amount.amount == null) {
                    item.fundType.loan_amount = null;
                }
                if (item.fundType.sanction_amount != null && item.fundType.sanction_amount.amount == null) {
                    item.fundType.sanction_amount = null;
                }
                if (item.fundType.min_peer_amt != null && item.fundType.min_peer_amt.amount == null) {
                    item.fundType.min_peer_amt = null;
                }
                if (item.fundType.current_valuation != null && item.fundType.current_valuation.amount == null) {
                    item.fundType.current_valuation = null;
                }
                data.push(item.fundType)
            });


            this.projectsService.saveProjectFundingDetails(data)
                .subscribe(
                    () => {
                        console.log('manage funding saved');
                        this.notifyBackerForNewFund();
                        this.projectsService.removeAllSelectedFund(this.projectId);
                        this.router.navigate([`/founder/projects/${this.projectId}/managefund`]);
                    },
                    (errMsg: any) => {
                        console.log('aali re aali error aali');
                        console.log(errMsg);
                        if(Array.isArray(errMsg)){
                            this.serverSideErrors = errMsg;
                            setTimeout(()=>{this.serverSideErrors = null},5000);
                        }
                    }
                );
        }
    }

    isArray(errors){
        return Array.isArray(errors);
    }

    notifyBackerForNewFund() {
        this.projectsService.notifyBackerForNewFund(this.projectId).subscribe((obj) => {
            console.log(obj);
        }, (error)=> {
            console.log(error);
        });
    }
}