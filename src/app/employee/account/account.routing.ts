import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FindWorkComponent } from './find-work/find-work.component';
import { StageStorage } from 'app/employeeprofile/stage-storage.service';
import { MyProposalsComponent } from './my-proposals/my-proposals.component';
import { ApplyJobComponent } from './apply-job/apply-job.component';
import { MyInterviewComponent } from './my-proposals/my-interview/my-interview.component';
import { MyAppointmentLetterComponent } from './my-proposals/my-appointment-letter/my-appointment-letter.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { DisputeComponent } from './dispute/dispute.component';
import { SnapshortProfileComponent } from './snapshort-profile/snapshort-profile.component';
import { CollaborationComponent } from './collaboration/collaboration.component';
import { CollaborationGoalProcessesComponent } from './collaboration/goal-processes/goal-processes.component';
import { CollaborationProcessDocumentsComponent } from './collaboration/process-documents/process-documents.component';
import { CollaborationDocumentComponent } from './collaboration/document/document.component';
import { DocumentChatComponent } from './collaboration/chat/chat.component';
import { AssignmentDetailsComponent } from './assignment-details/assignment-details.component';
import {
  EmployeeServiceWorkAreaComponent,
} from 'app/employee/account/project-list/employee-service-work-area/employee-service-work-area.component';
import {
  ServicesDocumentsComponent,
} from 'app/employee/account/project-list/employee-service-work-area/services-documents/services-documents.component';
import {
  ServiceDocumentComponent,
} from 'app/employee/account/project-list/employee-service-work-area/service-document/service-document.component';
import { ExtensionProcessComponent } from './collaboration/extension-process/extension-process.component';
import { EmployeeRatingComponent } from 'app/common/employee-rating/employee-rating.component';
import { WorkedOnComponent } from './project-list/worked-on/worked-on.component';
import { ActivityLogEmployeeComponent } from './collaboration/activity-log-employee/activity-log-employee.component';
import { PublicChatRoomComponent } from '../../collaboration/public-chat-room/public-chat-room.component';
import { CreatorListComponent } from './creator-list/creator-list.component';

const routes: Routes = [
  {
    path: '',
    component: FindWorkComponent,
  },
  {
    path: 'find-work',
    component: FindWorkComponent,
  },
  {
    path: 'profile',
    loadChildren: './edit/edit.module#EditModule',
  },
  {
    path: 'my-proposals',
    component: MyProposalsComponent,
  },
  {
    path: ':id/apply-job',
    component: ApplyJobComponent,
  },
  {
    path: ':id/snapshort',
    component: SnapshortProfileComponent,
  },
  {
    path: 'apply-job',
    component: ApplyJobComponent,
  },
  {
    path: ':id/:isApply/interview',
    component: MyInterviewComponent,
  },
  {
    path: ':id/:isApply/appointment-letter',
    component: MyAppointmentLetterComponent,
  },
  {
    path: 'interview',
    component: MyInterviewComponent,
  },
  {
    path: 'appointment-letter',
    component: MyAppointmentLetterComponent,
  },
  {
    path: 'project-list',
    component: ProjectListComponent,
  },
  {
    path: 'founder-list',
    component: CreatorListComponent,
  },
  {
    path: ':id/assignment-details',
    component: AssignmentDetailsComponent,
  },
  {
    path: ':id/process/:type',
    component: WorkedOnComponent,
  },
  {
    path: 'dispute',
    component: DisputeComponent,
  },
  {
    path: ':id/collaboration',
    component: CollaborationComponent,
    children: [
      {path: 'activity-log', component: ActivityLogEmployeeComponent, outlet: 'documents'},
      {path: 'extension/:processId', component: ExtensionProcessComponent, outlet: 'documents'},
      {path: 'goal/:goalId', component: CollaborationGoalProcessesComponent, outlet: 'documents'},
      {path: 'process/:processId', component: CollaborationProcessDocumentsComponent, outlet: 'documents'},
      {path: 'document/:documentId', component: CollaborationDocumentComponent, outlet: 'documents'},
      {path: 'chat/:processId', component: DocumentChatComponent, outlet: 'chat'},
      {path: 'public/channel', component: PublicChatRoomComponent, outlet: 'chat'},
      {path: 'lunch-room/:lunchRoomId', component: PublicChatRoomComponent, outlet: 'chat'},
    ],
  },
  {
    path: ':id/work-area',
    component: EmployeeServiceWorkAreaComponent,
    children: [
      {path: '', component: ServicesDocumentsComponent},
      {path: 'document/:documentId', component: ServiceDocumentComponent},
    ],
  },
  {
    path: ':empId/:processId/:rateFor',
    component: EmployeeRatingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [StageStorage],
  // declarations:[FindWorkComponent]
})
export class AccountRoutingModule {
}
