import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectsService } from 'app/projects/projects.service';
import FundTypes from 'app/projects/fundtypes.enum';
import ProjectBackerFundingModel from 'app/projects/models/ProjectBackerFundingModel';
import ProjectFundingModel from 'app/projects/models/ProjectFundingModel';
import { BackerProjectCrowdEquityFunding } from 'app/backer/projects/backer-funding/backer-funding-type/crowd-equity/crowd-equity.component';
import { BackerProjectCompanyBuyOfferFunding } from 'app/backer/projects/backer-funding/backer-funding-type/company-buy-offer/company-buy-offer.component';
import { BackerProjectCrowdNormalFunding } from 'app/backer/projects/backer-funding/backer-funding-type/crowd-normal/crowd-normal.component';
import { BackerProjectLoanServiceFunding } from 'app/backer/projects/backer-funding/backer-funding-type/loan-service/loan-service.component';
import { BackerProjectOfferRoleFunding } from 'app/backer/projects/backer-funding/backer-funding-type/offer-role/offer-role.component';
import { BackerProjectPToPLoanLendFunding } from 'app/backer/projects/backer-funding/backer-funding-type/p2p-loan-lend/p2p-loan-lend.component';
import { BackerProjectSplitEquityFunding } from 'app/backer/projects/backer-funding/backer-funding-type/split-equity/split-equity.component';

import { Message } from 'primeng/primeng';
import { LoaderService } from 'app/loader.service';

@Component({
  selector: 'app-backer-funding-type',
  templateUrl: './backer-funding-type.component.html',
  styleUrls: ['./backer-funding-type.component.scss']
})
export class BackerFundingTypeComponent implements OnInit {

  fundTypes = FundTypes;
  selectedFundTypes: { projectId: number, fundType: ProjectBackerFundingModel }[];
  projectId: number;
  selectedFundTypeCount: number;
  currentFundTypeIndex: number;
  currentFund: ProjectBackerFundingModel = new ProjectBackerFundingModel();
  serverSideErrors: any;

  msgs1: Message[] = [];

  showSummary: boolean = false;

  @ViewChild(BackerProjectCrowdEquityFunding) childCrowdEquity;
  @ViewChild(BackerProjectCompanyBuyOfferFunding) childCompanyBuyOffer;
  @ViewChild(BackerProjectCrowdNormalFunding) childCrowdNormal;
  @ViewChild(BackerProjectLoanServiceFunding) childLoanService;
  @ViewChild(BackerProjectOfferRoleFunding) childOfferRole;
  @ViewChild(BackerProjectPToPLoanLendFunding) childP2P;
  @ViewChild(BackerProjectSplitEquityFunding) childSplitEquity;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private loaderService:LoaderService
  ) {

  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.selectedFundTypes = this.projectsService.getBackerSelectedFundToProceed(this.projectId);
      if (!this.selectedFundTypes || this.selectedFundTypes.length == 0) {
        this.router.navigate([`/backer/projects/${this.projectId}/funding`]);
      }
      else {
        this.selectedFundTypeCount = this.selectedFundTypes.length;
        this.currentFundTypeIndex = 0;
        this.loadCurrentFundType();
      }
    });
  }

  goBack() {
    if (this.currentFundTypeIndex == 0) {
      this.router.navigate([`/backer/projects/${this.projectId}/funding`]);
    }
    else {
      this.currentFundTypeIndex--;
      this.showSummary = false;
      this.loadCurrentFundType();
    }
  }

  onNext() {
    //console.log(this.selectedFundTypes[this.currentFundTypeIndex].fundType);
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
    let current = this.selectedFundTypes[this.currentFundTypeIndex].fundType;

    this.projectsService.getProjectFundingTypeDetailsForBacker(this.projectId, current.fund)
      .subscribe((creatorFundData: ProjectFundingModel) => {
        current.creatorFundData = creatorFundData;
        this.currentFund = current;
        console.log(this.currentFund);
      });
  }

  submitFundingTypes() {
    console.log('this.selectedFundTypes');
    console.log(this.selectedFundTypes);
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
      let data: ProjectBackerFundingModel[] = [];
      console.log(this.selectedFundTypes);
      this.selectedFundTypes.forEach((item) => {
        let d: ProjectBackerFundingModel = new ProjectBackerFundingModel();

        d.return_form = item.fundType.creatorFundData.return_form;
        d.payment_type = item.fundType.creatorFundData.payment_type;
        d.sanction_amount = item.fundType.creatorFundData.sanction_amount;
        d.interest_rate = item.fundType.creatorFundData.interest_rate;
        d.min_peer_amt = item.fundType.creatorFundData.min_peer_amt;
        d.fund_amount = item.fundType.creatorFundData.fund_amount;
        d.fund = item.fundType.creatorFundData.id;
        d.creatorFundData = null;

        if(d.sanction_amount!=null && d.sanction_amount.amount==null){
          d.sanction_amount.amount = 0;
        }
        if(d.min_peer_amt!=null && d.min_peer_amt==null)
        {
          d.min_peer_amt.amount = 0;
        }
        if(d.fund_amount!=null && d.fund_amount==null)
        {
          d.fund_amount.amount = 0;
        }
        d.loan_amount.amount = 0;

        switch (item.fundType.fund) {
          case this.fundTypes.CrowdFunding:
            if (item.fundType.quantity != null && item.fundType.quantity > 0) {
              d.quantity = item.fundType.quantity;
              data.push(d);
            }
            break;
          case this.fundTypes.NormalCrowdFunding:
            if (item.fundType.fund_amount != null && item.fundType.fund_amount.amount > 0) {
              d.fund_amount = item.fundType.fund_amount;
              data.push(d);
            }
            break;
          case this.fundTypes.DebtFinancing:
            //not yet implemented
            break;
          case this.fundTypes.LoanServices:
          case this.fundTypes.P2PLoan:
            if (item.fundType.loan_amount != null && item.fundType.loan_amount.amount > 0) {
              d.sanction_amount = item.fundType.loan_amount;
              data.push(d);
            }
            break;
          case this.fundTypes.CompanyBuyOffer:
            if(item.fundType.buyCompany===true){
              data.push(d);
            }
            break;
          case this.fundTypes.OfferBuyRole:
          case this.fundTypes.SplitEquity:
            console.log(item.fundType.company_shares_backer);
            if(item.fundType.company_shares_backer && item.fundType.company_shares_backer.length>0)
            {
              d.company_shares_backer = item.fundType.company_shares_backer;
              data.push(d);
              console.log(data);
            }
            break;
          case 9:
            //not yet implemented
            break;
          default:
            break;
        }
      });

      console.log('data to be post');
      console.log(data);
      if(!data || data.length == 0)
      {
        this.router.navigate([`/backer/projects/${this.projectId}/funding`]);
        return;
      }

      this.projectsService.saveBackerFundingDetails(data)
        .subscribe(
          () => {
            console.log('manage funding saved');
            this.loaderService.growlMessage.next({severity:'success', summary:'Payment deducted from your wallet!!!'});
            this.projectsService.removeAllBackerSelectedFund(this.projectId);
            this.router.navigate([`/backer/projects/${this.projectId}/funding`]);
            this.msgs1.push({severity:'success', summary:'Payment successful!!!'});
          },
          (errMsg: any) => {
            console.log('aali re aali error aali');
            console.log(errMsg);
            if (Array.isArray(errMsg)) {
              this.serverSideErrors = errMsg;
              setTimeout(() => { this.serverSideErrors = null }, 5000);
            }
          }
        );
    }
  }

  isArray(errors) {
    return Array.isArray(errors);
  }
}
