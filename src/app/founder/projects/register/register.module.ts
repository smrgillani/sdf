import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NavbarModule} from 'app/core/navbar/navbar.module';
import { Routes, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {ResponsiveModule} from 'ng2-responsive';
import {NgbCollapseModule, NgbPopoverModule} from '@ng-bootstrap/ng-bootstrap';

import { ProjectRegisterOverviewComponent } from './overview/overview.component';
import { RegisterRoutingModule } from './register.routing';
import { ProjectEntitySelectionComponent } from 'app/founder/projects/register/entity-selection/entity-selection.component';
import { ProjectRegisterService } from 'app/projects/register.service';
import { RegistrationQuestionnaireService } from 'app/founder/projects/register/questionnaire/RegistrationQuestionnaireService';
import {FileDroppa} from 'file-droppa/lib/index';
import {AppElementsModule} from 'app/elements/elements.module';
import {SpreadSheetModule} from 'app/elements/spreadsheet/spreadsheet.module';

import {StageComponent} from './stage/stage.component';
import { RegisterNavBarComponent } from 'app/founder/projects/register/stage/navbar/navbar.component';
import { RegistrationQAComponent } from 'app/founder/projects/register/questionnaire/qa/qa.component';
import { PlaceOrderComponent } from './stage/placeorder/placeorder.component';
import { MyPrimeNgModule } from 'app/my-prime-ng.module';
import { ProjectregisteredComponent } from './stage/projectregistered/projectregistered.component';


@NgModule({
  imports: [
    CommonModule,
    NavbarModule,
    FormsModule,
    ReactiveFormsModule,
    RegisterRoutingModule,
    ResponsiveModule,
    PerfectScrollbarModule.forChild(),
    NgbCollapseModule.forRoot(),
    NgbPopoverModule,
    FileDroppa,
    AppElementsModule,
    SpreadSheetModule,
    MyPrimeNgModule
  ],
  declarations: [
    ProjectRegisterOverviewComponent,
    ProjectEntitySelectionComponent,
    StageComponent,
    PlaceOrderComponent,
    RegisterNavBarComponent,
    RegistrationQAComponent,
    ProjectregisteredComponent,
  ],
  providers:[
    ProjectRegisterService,
    RegistrationQuestionnaireService
  ]
})
export class ProjectRegisterModule { }
