import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbPopoverModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {WjGridSheetModule} from 'wijmo/wijmo.angular2.grid.sheet';

import {NavbarModule} from 'app/core/navbar/navbar.module';
import {AppElementsModule} from 'app/elements/elements.module';
import {AppQuestionnaireModule} from 'app/questionnaire/questionnaire.module';
import {ProjectsService} from 'app/projects/projects.service';
import {QuestionnaireService} from 'app/questionnaire/questionnaire.service';
import {StageStorage} from 'app/questionnaire/StageStorage';

import {StartupRoutingModule} from './startup.routing';
import {FounderStartupOverviewComponent} from './overview/overview.component';
import {StartupStageComponent} from './stage/stage.component';
import {BubbleNavBarComponent} from './stage/navbar/navbar.component';
import {FinancesOutlineComponent} from './finances-outline/financesoutline.component';
import {SpreadSheetModule} from 'app/elements/spreadsheet/spreadsheet.module';


@NgModule({
  imports: [
    CommonModule,
    NgbPopoverModule,
    NavbarModule,
    FormsModule,
    StartupRoutingModule,
    SpreadSheetModule,
    AppElementsModule,
    AppQuestionnaireModule,
    WjGridSheetModule,
  ],
  declarations: [
    FounderStartupOverviewComponent,
    FinancesOutlineComponent,
    FounderStartupOverviewComponent,
    FinancesOutlineComponent,
    StartupStageComponent,
    BubbleNavBarComponent
  ],
  providers: [
    ProjectsService,
    QuestionnaireService,
    StageStorage
  ]
})
export class FounderStartupModule {}
