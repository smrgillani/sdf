import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbPopoverModule,
  NgbCollapseModule,
  NgbTooltipModule,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { NavbarModule } from 'app/core/navbar/navbar.module';
import { AppElementsModule } from 'app/elements/elements.module';
import { AppPipesModule } from 'app/pipes/pipes.module';
import { AppProjectsModule } from 'app/projects/projects.module';
import { ProjectsService } from 'app/projects/projects.service';
import { QuestionnaireService } from 'app/questionnaire/questionnaire.service';

import { FileDroppa } from 'file-droppa/lib/index';

import { FounderProjectsRoutingModule } from './projects.routing';
import { FounderProjectsOverviewComponent } from './overview/overview.component';
import { FounderProjectDetailsComponent } from './details/details.component';
import { FounderProjectSummaryComponent } from './summary/summary.component';
import { ProjectCollaborationModule } from './collaboration/collaboration.module';
import { FounderProjectsDetailsBoardsModule } from './details/boards/boards.module';
import { TaskDashboardModule } from './details/task-dashboard/task-dashboard.module';
import { FounderProjectRecruitmentComponent } from './recruitment/recruitment.component';
import { PostJobComponent } from './recruitment/post-job/post-job.component';
import { HireEmployeesComponent } from './recruitment/hire-employees/hire-employees.component';
import { FiltersComponent } from './recruitment/filters/filters.component';
import { ProposalsComponent } from './recruitment/proposals/proposals.component';
import { MyEmployeeComponent } from './recruitment/my-employee/my-employee.component';
import { PreviousEmployeesComponent } from './recruitment/previous-employees/previous-employees.component';
import { AppointmentLetterComponent } from './recruitment/appointment-letter/appointment-letter.component';
import { MyJobPostingResponseComponent } from './recruitment/proposals/my-job-posting-response/my-job-posting-response.component';
import { DirectHireResponseComponent } from './recruitment/proposals/direct-hire-response/direct-hire-response.component';
import { RecruitmentService } from 'app/projects/recruitment.service';
import { Ng2DatetimePickerModule } from 'ng2-datetime-picker';
import { HireEmployeeFilterComponent } from './recruitment/hire-employee-filter/hire-employee-filter.component';
import { ScheduledInterviewComponent } from './recruitment/scheduled-interview/scheduled-interview.component';
import { RescheduledInterviewComponent } from './recruitment/rescheduled-interview/rescheduled-interview.component';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
import { ContactDetailsComponent } from './employee-profile/contact-details/contact-details.component';
import { ProcessesWorkedOnComponent } from './employee-profile/processes-worked-on/processes-worked-on.component';
import { MakePaymentComponent } from './employee-profile/make-payment/make-payment.component';
import { TerminationLetterComponent } from './recruitment/termination-letter/termination-letter.component';
import { MyPrimeNgModule } from '../../my-prime-ng.module';
import { SharedEmployeeModule } from '../../shared/sharedEmployee.module';
import { NdaComponent } from './summary/nda/nda.component';
import { SharedInterviewRescheduleModule } from 'app/shared/shared-interview-reschedule.module';
import { ActivityFeedComponent } from './details/activity-feed/activity-feed.component';
import { ProcessDueSoonComponent } from './details/process-due-soon/process-due-soon.component';
import { FounderProjectLaunchComponent } from './launch/launch.component';
import { FounderProjectLaunchedComponent } from 'app/founder/projects/launch/launched/launched.component';
import { FounderProjectManageFundComponent } from 'app/founder/projects/managefund/managefund.component';
import { FounderProjectFundingTypeComponent } from 'app/founder/projects/managefund/funding-type/funding-type.component';
import { FounderProjectCrowdEquityFunding } from 'app/founder/projects/managefund/funding-type/crowd-equity/crowd-equity.component';
import {
  FounderProjectCompanyBuyOfferFunding
} from 'app/founder/projects/managefund/funding-type/company-buy-offer/company-buy-offer.component';
import { FounderProjectCrowdNormalFunding } from 'app/founder/projects/managefund/funding-type/crowd-normal/crowd-normal.component';
import { FounderProjectLoanServiceFunding } from './managefund/funding-type/loan-service/loan-service.component';
import { FounderProjectOfferRoleFunding } from './managefund/funding-type/offer-role/offer-role.component';
import { FounderProjectPToPLoanLendFunding } from './managefund/funding-type/p2p-loan-lend/p2p-loan-lend.component';
import { FounderProjectSplitEquityFunding } from './managefund/funding-type/split-equity/split-equity.component';
import { NotarizationComponent } from './notarization/notarization.component';
import { SentNotarizationComponent } from './sent-notarization/sent-notarization.component';
import { ViewnotarizationComponent } from './viewnotarization/viewnotarization.component';
import { SignInInfoComponent } from './viewnotarization/sign-in-info/sign-in-info.component';
import { NotaryInfoComponent } from './viewnotarization/notary-info/notary-info.component';
import { ConfirmationService } from 'primeng/primeng';
import { FounderProjectEditFundingTypeComponent } from 'app/founder/projects/managefund/edit/edit-fund-type.component';
import { EmployeePayComponent } from './recruitment/pay/employee-pay.component';
import { PaymentService } from '../../projects/payment.service';
import { MetricesService } from '../../projects/metrices.service';
import { WorkRecordingsComponent } from './work-recordings/work-recordings.component';
import { ProjectPhotoComponent } from './project-photo/project-photo.component';
import { SharedModule } from 'app/shared/shared.module';
import { BackerAccessListComponent } from './backer-access-list/backer-access-list.component';
import { BonusHikePopupComponent } from './recruitment/pay/bonus-hike-popup/bonus-hike-popup.component';
import { RequestsComponent } from './recruitment/requests/requests.component';
import { MaterialModule } from 'app/material.module';


@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    NgbModule,
    NgbPopoverModule,
    NgbCollapseModule,
    NgbTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarModule,
    AppElementsModule,
    AppPipesModule,
    FileDroppa,
    AppProjectsModule,
    FounderProjectsRoutingModule,
    ProjectCollaborationModule,
    FounderProjectsDetailsBoardsModule,
    TaskDashboardModule,
    PerfectScrollbarModule.forChild(),
    Ng2DatetimePickerModule,
    MyPrimeNgModule,
    SharedEmployeeModule,
    SharedInterviewRescheduleModule,
    SharedModule,
  ],
  declarations: [
    FounderProjectsOverviewComponent,
    FounderProjectDetailsComponent,
    FounderProjectSummaryComponent,
    FounderProjectRecruitmentComponent,
    PostJobComponent,
    HireEmployeesComponent,
    FiltersComponent,
    ProposalsComponent,
    MyEmployeeComponent,
    PreviousEmployeesComponent,
    AppointmentLetterComponent,
    MyJobPostingResponseComponent,
    DirectHireResponseComponent,
    HireEmployeeFilterComponent,
    ScheduledInterviewComponent,
    RescheduledInterviewComponent,
    EmployeeProfileComponent,
    ContactDetailsComponent,
    ProcessesWorkedOnComponent,
    MakePaymentComponent,
    TerminationLetterComponent,
    NdaComponent,
    ActivityFeedComponent,
    ProcessDueSoonComponent,
    FounderProjectLaunchComponent,
    FounderProjectLaunchedComponent,
    FounderProjectManageFundComponent,
    FounderProjectFundingTypeComponent,
    FounderProjectEditFundingTypeComponent,
    FounderProjectCrowdEquityFunding,
    FounderProjectCompanyBuyOfferFunding,
    FounderProjectCrowdNormalFunding,
    FounderProjectLoanServiceFunding,
    FounderProjectOfferRoleFunding,
    FounderProjectPToPLoanLendFunding,
    FounderProjectSplitEquityFunding,
    NotarizationComponent,
    SentNotarizationComponent,
    ViewnotarizationComponent,
    SignInInfoComponent,
    NotaryInfoComponent,
    EmployeePayComponent,
    WorkRecordingsComponent,
    ProjectPhotoComponent,
    BackerAccessListComponent,
    BonusHikePopupComponent,
    RequestsComponent,
  ],
  providers: [
    ProjectsService,
    QuestionnaireService,
    RecruitmentService,
    PaymentService,
    ConfirmationService,
    MetricesService,
  ],
  entryComponents: [
    AppointmentLetterComponent,
    ScheduledInterviewComponent,
    RescheduledInterviewComponent,
    TerminationLetterComponent,
  ],
})
export class FounderProjectsModule {
}
