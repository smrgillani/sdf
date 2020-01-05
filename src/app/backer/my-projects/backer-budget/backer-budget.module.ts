import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NgbModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService } from 'primeng/primeng';

import { BackerBudgetRoutingModule } from './backer-budget-routing.module';
import { AppElementsModule } from 'app/elements/elements.module';
import { MyPrimeNgModule } from 'app/my-prime-ng.module';

import { BudgetOverviewComponent } from './budget-overview/budget-overview.component';
import { BudgetPaymentComponent } from './budget-payment/budget-payment.component';
import { BackerMaterialCostComponent } from './backer-material-cost/backer-material-cost.component';
import { BackerLaunchFundingComponent } from './backer-launch-funding/backer-launch-funding.component';
import { BackerManageFundingComponent } from './backer-manage-funding/backer-manage-funding.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    CommonModule,    
    NgbModule,
    AppElementsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbCollapseModule,
    MyPrimeNgModule,
    PerfectScrollbarModule,
    BackerBudgetRoutingModule
  ],
  declarations: [BudgetOverviewComponent, BudgetPaymentComponent, BackerMaterialCostComponent, BackerLaunchFundingComponent, BackerManageFundingComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    ConfirmationService
  ]
})
export class BackerBudgetModule { }
