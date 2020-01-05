import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FounderProjectBudgetOverviewComponent } from './overview/overview.component';
import { PaymentComponent } from './payment/payment.component';
import { MaterialCostComponent } from './material-cost/material-cost.component';
import { MyFundsComponent } from './my-funds/my-funds.component';
import { ManageFundingComponent } from './manage-funding/manage-funding.component';
import { ManageIsxComponent } from './manage-isx/manage-isx.component';
import { ManageLsxComponent } from './manage-lsx/manage-lsx.component';
import { SelectedFundingComponent } from './manage-funding/selected-funding/selected-funding.component';
import { UpgradeFundingComponent } from './manage-funding/upgrade-funding/upgrade-funding.component';
import { FundingTypeComponent } from './manage-funding/funding-type/funding-type.component';
import { ViewLaunchFundingComponent } from 'app/founder/projects/budget/view-launch-funding/view-launch-funding.component';
import { ViewManageFundingComponent } from './view-manage-funding/view-manage-funding.component';
import { InterestPayComponent } from './interest-pay/interest-pay.component';
import { PaymentRatingComponent } from './payment-rating/payment-rating.component';


const routes: Routes = [
  {
    path: '',
    component: FounderProjectBudgetOverviewComponent
  },
  {
    path: 'payment',
    component: PaymentComponent
  },
  {
    path: 'payment/:transaction',
    component: PaymentRatingComponent
  },
  {
    path: 'materialcost',
    component: MaterialCostComponent
  },
  {
    path: 'viewlaunch',
    component: ViewLaunchFundingComponent
  },
  {
    path: 'viewmanagefund',
    component: ViewManageFundingComponent
  },
  {
    path: 'myfunds',
    component: MyFundsComponent
  },
  {
    path: 'managefunding',
    component: ManageFundingComponent
  },
  {
    path: 'selectedfunding',
    component: SelectedFundingComponent
  },
  {
    path: 'upgradefunding',
    component: UpgradeFundingComponent
  },
  {
    path: 'manageisx',
    component: ManageIsxComponent
  },
  {
    path: 'managelsx',
    component: ManageLsxComponent
  },
  {
    path: 'fundingtype',
    component: FundingTypeComponent
  },
  {
    path: ':fundId/interest-pay',
    component: InterestPayComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetRoutingModule { }
