import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbPopoverModule,
  NgbCollapseModule,
  NgbTooltipModule,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';

import { MyPrimeNgModule } from 'app/my-prime-ng.module';

import { NavbarModule } from 'app/core/navbar/navbar.module';
import { AppElementsModule } from 'app/elements/elements.module';
import { ProjectsService } from 'app/projects/projects.service';
import { AppProjectsModule } from 'app/projects/projects.module';
import { BackerMyProjectsRoutingModule } from './my-projects.routing';
import { WebrtcModule } from 'app/webrtc/webrtc.module';
import { MyProjectsComponent } from './overview/overview.component';
import { AppPipesModule } from '../../pipes/pipes.module';
import { MyProjectsSummaryComponent } from 'app/backer/my-projects/summary/summary.component';
import { SpreadSheetModule } from 'app/elements/spreadsheet/spreadsheet.module';

import { SharedEmployeeModule } from 'app/shared/sharedEmployee.module';
import { CollaborationModule } from './collaboration/collaboration.module';
import { BackerProjectDetailsComponent } from './backer-project-details/backer-project-details.component';
import { BackerActivityFeedComponent } from './backer-project-details/backer-activity-feed/backer-activity-feed.component';
import { BackerProcessDueSoonComponent } from './backer-project-details/backer-process-due-soon/backer-process-due-soon.component';
import { BackerKanbanboardModule } from './backer-kanbanboard/backer-kanbanboard.module';
import { BackerRecruitmentComponent } from './backer-recruitment/backer-recruitment.component';
import { BackerProposalsComponent } from './backer-recruitment/backer-proposals/backer-proposals.component';
import {
  BackerDirectHireResponseComponent
} from './backer-recruitment/backer-proposals/backer-direct-hire-response/backer-direct-hire-response.component';
import {
  BackerJobPostingResponseComponent
} from './backer-recruitment/backer-proposals/backer-job-posting-response/backer-job-posting-response.component';
import { BackerMyEmployeeComponent } from './backer-recruitment/backer-my-employee/backer-my-employee.component';
import { BackerPreviousEmployeesComponent } from './backer-recruitment/backer-previous-employees/backer-previous-employees.component';
import { RecruitmentService } from 'app/projects/recruitment.service';
import { BackerEmployeeProfileComponent } from './backer-employee-profile/backer-employee-profile.component';
import { BackerBudgetModule } from './backer-budget/backer-budget.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarModule,
    AppElementsModule,
    AppProjectsModule,
    BackerMyProjectsRoutingModule,
    AppPipesModule,
    NgbModule,
    NgbPopoverModule,
    NgbCollapseModule,
    NgbTooltipModule,
    AppElementsModule,
    SpreadSheetModule,
    MyPrimeNgModule,
    CollaborationModule,
    WebrtcModule,
    SharedEmployeeModule,
    BackerKanbanboardModule,
    BackerBudgetModule,
  ],
  declarations: [
    MyProjectsSummaryComponent,
    MyProjectsComponent,
    BackerProjectDetailsComponent,
    BackerActivityFeedComponent,
    BackerProcessDueSoonComponent,
    BackerRecruitmentComponent,
    BackerProposalsComponent,
    BackerDirectHireResponseComponent,
    BackerJobPostingResponseComponent,
    BackerMyEmployeeComponent,
    BackerPreviousEmployeesComponent,
    BackerEmployeeProfileComponent,
  ],
  providers: [
    ProjectsService,
    RecruitmentService,
  ],
})
export class BackerMyProjectsModule {
}
