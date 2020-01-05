import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WjChartModule } from 'wijmo/wijmo.angular2.chart';
import { WjChartFinanceModule } from 'wijmo/wijmo.angular2.chart.finance';

import { TradingRoutingModule } from './trading-routing.module';
import { TradingTypeComponent } from './trading-type/trading-type.component';
import { TradingListingComponent } from './trading-listing/trading-listing.component';
import { ProjectLaunchComponent } from './trading-listing/project-launch/project-launch.component';
import { ProjectLaunchingSoonComponent } from './trading-listing/project-launching-soon/project-launching-soon.component';
import { MySharesComponent } from './my-shares/my-shares.component';
import { MyFundedProjectsComponent } from './my-shares/my-funded-projects/my-funded-projects.component';
import { SimilarProjectsComponent } from './my-shares/similar-projects/similar-projects.component';
import { MyShareXComponent } from './my-shares/my-funded-projects/my-share-x/my-share-x.component';
import { MyHoldingsLsxComponent } from './my-shares/my-funded-projects/my-holdings-lsx/my-holdings-lsx.component';
import { MyHoldingsIsxComponent } from './my-shares/my-funded-projects/my-holdings-isx/my-holdings-isx.component';
import { ProjectStockComponent } from './project-stock/project-stock.component';
import { RouterModule } from '@angular/router';
import { AppElementsModule } from 'app/elements/elements.module';

import { MyPrimeNgModule } from 'app/my-prime-ng.module';
import { NavbarModule } from 'app/core/navbar/navbar.module';
import {
  NgbModule,
  NgbCollapseModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TradingService } from '../../projects/trading.service';
import { HoldingSharesComponent } from './my-shares/holding-shares/holding-shares.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TradingRoutingModule,
    NgbModule,
    AppElementsModule,
    MyPrimeNgModule,
    NavbarModule,
    NgbCollapseModule,
    WjChartModule,
    WjChartFinanceModule,
    RouterModule,
  ],
  declarations: [
    TradingTypeComponent,
    TradingListingComponent,
    ProjectLaunchComponent,
    ProjectLaunchingSoonComponent,
    MySharesComponent,
    MyFundedProjectsComponent,
    SimilarProjectsComponent,
    MyShareXComponent,
    MyHoldingsLsxComponent,
    MyHoldingsIsxComponent,
    ProjectStockComponent,
    HoldingSharesComponent,
  ],
  providers: [TradingService],
})
export class TradingModule {
}
