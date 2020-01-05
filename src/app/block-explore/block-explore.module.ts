import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { AppElementsModule} from 'app/elements/elements.module';
import { AppPipesModule } from 'app/pipes/pipes.module';
import { BlockExploreRoutingModule } from './block-explore-routing.module';
import { BlockOverviewComponent } from './overview/overview.component';
import { HomeComponent } from './overview/home/home.component';
import { BlockInfoComponent } from './overview/block-info/block-info.component';

import { BlockService } from 'app/block-explore/block-explores/services/block.service';
import { BlockSummaryComponent } from './overview/block-summary/block-summary.component';
import { BlockTxComponent } from './overview/block-tx/block-tx.component';
import { BlockAddressComponent } from './overview/block-address/block-address.component';
import { ProjectRegistrationComponent } from './overview/project-registration/project-registration.component';
import { ProjectNotarizationComponent } from './overview/project-notarization/project-notarization.component';
import { FinancialTransactionsComponent } from './overview/financial-transactions/financial-transactions.component';
import { ActionButtonsComponent } from './overview/action-buttons/action-buttons.component';
import { SignedDocumentsComponent } from './overview/signed-documents/signed-documents.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgbCollapseModule,
    AppElementsModule,
    AppPipesModule,
    BlockExploreRoutingModule
  ],
  providers: [BlockService],
  declarations: [BlockOverviewComponent, HomeComponent, BlockInfoComponent, BlockSummaryComponent, BlockTxComponent, BlockAddressComponent, ProjectRegistrationComponent, ProjectNotarizationComponent, FinancialTransactionsComponent, ActionButtonsComponent, SignedDocumentsComponent]

})
export class BlockExploreModule { }
