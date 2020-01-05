import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BudgetOverviewComponent } from './budget-overview/budget-overview.component';
import { BudgetPaymentComponent } from './budget-payment/budget-payment.component';
import { BackerMaterialCostComponent } from './backer-material-cost/backer-material-cost.component';
import { BackerLaunchFundingComponent } from './backer-launch-funding/backer-launch-funding.component';
import { BackerManageFundingComponent } from './backer-manage-funding/backer-manage-funding.component';

const routes: Routes = [
  {
    path: '',
    component: BudgetOverviewComponent
  },
  {
    path: 'payment',
    component: BudgetPaymentComponent
  },
  {
    path: 'materialcost',
    component: BackerMaterialCostComponent
  },
  {
    path: 'viewlaunch',
    component: BackerLaunchFundingComponent
  },
  {
    path: 'viewmanagefund',
    component: BackerManageFundingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackerBudgetRoutingModule { }
