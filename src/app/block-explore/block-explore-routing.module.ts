import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlockOverviewComponent } from 'app/block-explore/overview/overview.component';
import { BlockSummaryComponent } from './overview/block-summary/block-summary.component';
import { BlockTxComponent } from 'app/block-explore/overview/block-tx/block-tx.component';
import { BlockAddressComponent } from 'app/block-explore/overview/block-address/block-address.component';

const routes: Routes = [
  {
    path: '',
    component: BlockOverviewComponent
  },
  {
    path: ':block/block',
    component: BlockSummaryComponent
  },
  {
    path: ':tx/tx',
    component: BlockTxComponent
  },
  {
    path: ':address/address',
    component: BlockAddressComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlockExploreRoutingModule { }
