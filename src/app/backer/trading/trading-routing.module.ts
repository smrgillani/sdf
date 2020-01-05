import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TradingTypeComponent } from './trading-type/trading-type.component';
import { TradingListingComponent } from './trading-listing/trading-listing.component';
import { MySharesComponent } from './my-shares/my-shares.component';
import { ProjectStockComponent } from './project-stock/project-stock.component';

const routes: Routes = [
  {
    path: '',
    component: TradingTypeComponent,
  },
  {
    path: ':pagename/:id/projecttrading',
    component: ProjectStockComponent,
  },
  {
    path: 'myshares',
    component: MySharesComponent,
  },
  {
    path: ':pagename',
    component: TradingListingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TradingRoutingModule {
}
