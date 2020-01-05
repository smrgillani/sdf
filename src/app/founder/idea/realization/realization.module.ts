import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ResponsiveModule } from 'ng2-responsive';
import { NgbCollapseModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';


import { NavbarModule } from 'app/core/navbar/navbar.module';
import { StageComponent } from './stage/stage.component';
import { RealizationOverviewComponent } from './overview/overview.component';
import { IdeaRealizationRoutingModule } from './realization.routing';
import { MyPrimeNgModule } from '../../../my-prime-ng.module';
import { BubbleNavBarComponent } from './stage/navbar/navbar.component';
import { IdeaSharedModule } from '../shared/shared.module';
import { AppElementsModule } from 'app/elements/elements.module';
import { AppQuestionnaireModule } from 'app/questionnaire/questionnaire.module';


@NgModule({
  imports: [
    CommonModule,
    NavbarModule,
    IdeaRealizationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ResponsiveModule,

    PerfectScrollbarModule.forRoot(),
    NgbCollapseModule.forRoot(),

    IdeaSharedModule,
    AppElementsModule,
    MyPrimeNgModule,
    NgbPopoverModule,

    AppQuestionnaireModule,
  ],
  declarations: [
    RealizationOverviewComponent,
    StageComponent,
    BubbleNavBarComponent,
  ],
})
export class RealizationModule {
}
