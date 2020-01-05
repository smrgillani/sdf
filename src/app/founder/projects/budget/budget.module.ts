import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BudgetRoutingModule } from './budget-routing';
import { FounderProjectBudgetOverviewComponent } from './overview/overview.component';
import { AppElementsModule } from '../../../elements/elements.module';
import { PaymentComponent } from './payment/payment.component';
import { MaterialCostComponent } from './material-cost/material-cost.component';
import { ManageFundingComponent } from './manage-funding/manage-funding.component';
import { MyFundsComponent } from './my-funds/my-funds.component';
import { IsxFundingComponent } from './my-funds/isx-funding/isx-funding.component';
import { XFundingComponent } from './my-funds/x-funding/x-funding.component';

import {
  NgbCollapseModule,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ManageIsxComponent } from './manage-isx/manage-isx.component';
import { ManageLsxComponent } from './manage-lsx/manage-lsx.component';
import { MyPrimeNgModule } from 'app/my-prime-ng.module';
import { SelectedFundingComponent } from './manage-funding/selected-funding/selected-funding.component';
import { UpgradeFundingComponent } from './manage-funding/upgrade-funding/upgrade-funding.component';
import { FundingTypeComponent } from './manage-funding/funding-type/funding-type.component';
import { UnsubscribeNewUpgradeComponent } from './manage-funding/upgrade-funding/unsubscribe-new-upgrade/unsubscribe-new-upgrade.component';
import { ProductWallmartSearchComponent } from './material-cost/wallmart-search/wallmart-search.component';
import { ConfirmationService } from 'primeng/primeng';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ViewLaunchFundingComponent } from 'app/founder/projects/budget/view-launch-funding/view-launch-funding.component';
import { ViewManageFundingComponent } from './view-manage-funding/view-manage-funding.component';
import { InterestPayComponent } from './interest-pay/interest-pay.component';
import { PaymentRatingComponent } from './payment-rating/payment-rating.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    BudgetRoutingModule,
    AppElementsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbCollapseModule,
    MyPrimeNgModule,
    PerfectScrollbarModule
  ],
  declarations: [
    FounderProjectBudgetOverviewComponent, 
    PaymentComponent, 
    MaterialCostComponent, 
    ProductWallmartSearchComponent,
    ManageFundingComponent, 
    MyFundsComponent, 
    IsxFundingComponent, 
    XFundingComponent, 
    ManageIsxComponent, 
    ManageLsxComponent, 
    SelectedFundingComponent, 
    UpgradeFundingComponent, 
    FundingTypeComponent, 
    UnsubscribeNewUpgradeComponent,
    ViewLaunchFundingComponent,
    ViewManageFundingComponent,
    InterestPayComponent,
    PaymentRatingComponent,
  ],
  entryComponents: [UnsubscribeNewUpgradeComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    ConfirmationService
  ]
})
export class BudgetModule { }
