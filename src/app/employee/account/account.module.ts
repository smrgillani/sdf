import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  NgbPopoverModule,
  NgbCollapseModule,
  NgbTooltipModule,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { Ng2DatetimePickerModule } from 'ng2-datetime-picker';
import { AccountRoutingModule } from './account.routing';
import { EditComponent } from './edit/edit.component';
import { FindWorkComponent } from './find-work/find-work.component';
import { FiltersComponent } from './find-work/filters/filters.component';
import { MyProposalsComponent } from './my-proposals/my-proposals.component';
import { ApplyJobComponent } from './apply-job/apply-job.component';
import { ApplyForComponent } from './my-proposals/apply-for/apply-for.component';
import { RecruiterInterviewRequestComponent } from './my-proposals/recruiter-interview-request/recruiter-interview-request.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MyPrimeNgModule } from '../../my-prime-ng.module';
import { AppElementsModule } from 'app/elements/elements.module';
import { MyInterviewComponent } from './my-proposals/my-interview/my-interview.component';
import { MyAppointmentLetterComponent } from './my-proposals/my-appointment-letter/my-appointment-letter.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { OngoingProjectsComponent } from './project-list/ongoing-projects/ongoing-projects.component';
import { PastProjectsComponent } from './project-list/past-projects/past-projects.component';
import { DisputeComponent } from './dispute/dispute.component';
import { SnapshortProfileComponent } from './snapshort-profile/snapshort-profile.component';
import { DirectHireComponent } from './my-proposals/direct-hire/direct-hire.component';
import { SharedEmployeeModule } from 'app/shared/sharedEmployee.module';
import { SharedInterviewRescheduleModule } from 'app/shared/shared-interview-reschedule.module';
import { CollaborationModule } from './collaboration/collaboration.module';
import { ChatService } from 'app/collaboration/chat.service';
import { AssignmentsComponent } from './project-list/assignments/assignments.component';
import { AssignmentDetailsComponent } from './assignment-details/assignment-details.component';
import { AppPipesModule } from 'app/pipes/pipes.module';
import { FileDroppa } from 'file-droppa/lib/index';
import {
  EmployeeServiceWorkAreaModule,
} from 'app/employee/account/project-list/employee-service-work-area/employee-service-work-area.module';
import { ServiceExtensionComponent } from './project-list/assignments/service-extension/service-extension.component';
import { CommonComponentModule } from 'app/common/common.module';
import { WorkedOnComponent } from './project-list/worked-on/worked-on.component';
import { CreatorListComponent } from './creator-list/creator-list.component';
import { ChatApiService } from '../../collaboration/chat.api.service';


@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    AccountRoutingModule,
    PerfectScrollbarModule,
    MyPrimeNgModule,
    NgbPopoverModule,
    NgbCollapseModule,
    NgbTooltipModule,
    AppElementsModule,
    Ng2DatetimePickerModule,
    CollaborationModule,
    AppPipesModule,
    FileDroppa,
    SharedEmployeeModule,
    SharedInterviewRescheduleModule,
    EmployeeServiceWorkAreaModule,
    CommonComponentModule,
  ],
  providers: [
    ChatApiService,
    ChatService,
  ],
  declarations: [EditComponent, FindWorkComponent, FiltersComponent, MyProposalsComponent, ApplyJobComponent,
    ApplyForComponent, RecruiterInterviewRequestComponent, MyInterviewComponent, MyAppointmentLetterComponent,
    ProjectListComponent, OngoingProjectsComponent, PastProjectsComponent, DisputeComponent, SnapshortProfileComponent,
    DirectHireComponent,
    AssignmentsComponent,
    AssignmentDetailsComponent,
    ServiceExtensionComponent,
    WorkedOnComponent,
    CreatorListComponent,
  ],
  entryComponents: [ServiceExtensionComponent],
})
export class AccountModule {
}
