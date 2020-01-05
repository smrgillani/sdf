import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbPopoverModule,
  NgbCollapseModule,
  NgbTooltipModule,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';

import { MyPrimeNgModule } from 'app/my-prime-ng.module';

import { NavbarModule } from 'app/core/navbar/navbar.module';
import { AppElementsModule } from 'app/elements/elements.module';
import { ProjectsService } from 'app/projects/projects.service';
import { AppProjectsModule } from 'app/projects/projects.module';
import { BackerProjectsRoutingModule } from './projects.routing';
import { WebrtcModule } from 'app/webrtc/webrtc.module';
import { BackerProjectsOverviewComponent } from './overview/overview.component';
import { AppPipesModule } from '../../pipes/pipes.module';
import { BackerFundingComponent } from 'app/backer/projects/backer-funding/backer-funding.component';
import { BackerFundingTypeComponent } from 'app/backer/projects/backer-funding/backer-funding-type/backer-funding-type.component';
import { BackerLaunchTypeComponent } from 'app/backer/projects/backer-launch-type/backer-launch-type.component';
import {
  BackerProjectPToPLoanLendFunding
} from 'app/backer/projects/backer-funding/backer-funding-type/p2p-loan-lend/p2p-loan-lend.component';
import {
  BackerProjectCrowdNormalFunding
} from 'app/backer/projects/backer-funding/backer-funding-type/crowd-normal/crowd-normal.component';
import { BackerProjectsSummaryComponent } from 'app/backer/projects/summary/summary.component';
import { NdaAgreementComponent } from 'app/backer/projects/nda-agreement/nda-agreement.component';
import { ProjectTradingComponent } from 'app/backer/projects/project-trading/project-trading.component';
import { PlaceOrderComponent } from 'app/backer/projects/place-order/place-order.component';
import { SpreadSheetModule } from 'app/elements/spreadsheet/spreadsheet.module';
import { BackerProjectCompanyBuyOfferFunding } from './backer-funding/backer-funding-type/company-buy-offer/company-buy-offer.component';
import { BackerProjectCrowdEquityFunding } from './backer-funding/backer-funding-type/crowd-equity/crowd-equity.component';
import { BackerProjectLoanServiceFunding } from './backer-funding/backer-funding-type/loan-service/loan-service.component';
import { BackerProjectOfferRoleFunding } from './backer-funding/backer-funding-type/offer-role/offer-role.component';
import { BackerProjectSplitEquityFunding } from './backer-funding/backer-funding-type/split-equity/split-equity.component';
import { BackerPurchaseSuccessComponent } from 'app/backer/projects/backer-launch-type/purchase-success/purchase-success.component';
import { ProjectMessageComponent } from './project-message/project-message.component';
import { SharedEmployeeModule } from 'app/shared/sharedEmployee.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarModule,
    AppElementsModule,
    AppProjectsModule,
    BackerProjectsRoutingModule,
    AppPipesModule,
    NgbModule,
    NgbPopoverModule,
    NgbCollapseModule,
    NgbTooltipModule,
    AppElementsModule,
    SpreadSheetModule,
    MyPrimeNgModule,
    WebrtcModule,
    SharedEmployeeModule,
  ],
  declarations: [
    BackerProjectsSummaryComponent,
    NdaAgreementComponent,
    ProjectTradingComponent,
    BackerProjectsOverviewComponent,
    BackerFundingComponent,
    BackerFundingTypeComponent,
    BackerLaunchTypeComponent,
    PlaceOrderComponent,
    BackerProjectPToPLoanLendFunding,
    BackerProjectCrowdNormalFunding,
    BackerProjectCompanyBuyOfferFunding,
    BackerProjectCrowdEquityFunding,
    BackerProjectLoanServiceFunding,
    BackerProjectOfferRoleFunding,
    BackerProjectSplitEquityFunding,
    BackerPurchaseSuccessComponent,
    ProjectMessageComponent,
  ],
  providers: [
    ProjectsService,
  ],
})
export class BackerProjectsModule {
}
