import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FounderProjectsOverviewComponent } from './overview/overview.component';
import { FounderProjectSummaryComponent } from './summary/summary.component';
import { MakePaymentComponent } from './employee-profile/make-payment/make-payment.component';
import { NdaComponent } from './summary/nda/nda.component';
import { ActivityFeedComponent } from './details/activity-feed/activity-feed.component';
import { FounderProjectLaunchComponent } from './launch/launch.component';
import { FounderProjectManageFundComponent } from 'app/founder/projects/managefund/managefund.component';
import { FounderProjectFundingTypeComponent } from 'app/founder/projects/managefund/funding-type/funding-type.component';
import { NotarizationComponent } from './notarization/notarization.component';
import { SentNotarizationComponent } from './sent-notarization/sent-notarization.component';
import { ViewnotarizationComponent } from './viewnotarization/viewnotarization.component';
import { FounderProjectEditFundingTypeComponent } from 'app/founder/projects/managefund/edit/edit-fund-type.component';
import { WorkRecordingsComponent } from 'app/founder/projects/work-recordings/work-recordings.component';
import { IsTemporaryUser } from 'app/auth/permissions';
import { ProjectPhotoComponent } from './project-photo/project-photo.component';
import { BackerAccessListComponent } from './backer-access-list/backer-access-list.component';
// import { FounderProjectDetailsComponent } from './details/details.component';
// import { ProjectCollaborationComponent } from './collaboration/collaboration.component';
// import { CollaborationDocumentComponent } from './collaboration/document/document.component';
// import { CollaborationGoalProcessesComponent } from './collaboration/goal-processes/goal-processes.component';
// import { CollaborationProcessDocumentsComponent } from './collaboration/process-documents/process-documents.component';
// import { DocumentChatComponent } from './collaboration/chat/chat.component';
// import { FounderProjectRecruitmentComponent } from './recruitment/recruitment.component';
// import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
// import { ProcessesWorkedOnComponent } from './employee-profile/processes-worked-on/processes-worked-on.component';
// import { ProcessDueSoonComponent } from './details/process-due-soon/process-due-soon.component';
// import { EmployeePayComponent } from './recruitment/pay/employee-pay.component';
// import { ActivityLogBotComponent } from './collaboration/activity-log-bot/activity-log-bot.component';
// import { ActivityLogUserComponent } from './collaboration/activity-log-user/activity-log-user.component';
// import { PublicChatRoomComponent } from '../../collaboration/public-chat-room/public-chat-room.component';
// import { OperationsComponent } from 'app/projects/operations/operations.component';
// import { RequestsComponent } from './recruitment/requests/requests.component';


const routes: Routes = [
  {
    path: '',
    component: FounderProjectsOverviewComponent,
  },
  {
    path: 'work-recording',
    component: WorkRecordingsComponent,
    /*children: [
      {
        path: 'work-recording',
        component: WorkRecordingsComponent,
      }
    ]*/
  },
  {
    path: ':id', redirectTo: ':id/services', pathMatch: 'full',
  },
  {
    path: ':id/services',
    loadChildren: 'app/founder/order-service/order-service.module#OrderServiceModule',
  },
  {
    path: ':id/boards',
    loadChildren: 'app/founder/projects/details/boards/boards.module#FounderProjectsDetailsBoardsModule',
  },
  {
    path: ':id/summary',
    component: FounderProjectSummaryComponent,
  },
  {
    path: ':id/backer-access',
    component: BackerAccessListComponent,
  },
  {
    path: ':id/summary/photo',
    component: ProjectPhotoComponent,
  },
  {
    path: ':id/launch',
    component: FounderProjectLaunchComponent,
  },
  {
    path: ':id/managefund',
    component: FounderProjectManageFundComponent,
  },
  {
    path: ':id/managefund/fundingtype',
    component: FounderProjectFundingTypeComponent,
  },
  {
    path: ':id/managefund/:fundid/edit',
    component: FounderProjectEditFundingTypeComponent,
  },
  {
    path: ':id/MakePayment',
    component: MakePaymentComponent,
  },
  {
    path: ':id/register',
    loadChildren: './register/register.module#ProjectRegisterModule',
    canActivate: [IsTemporaryUser],
  },
  {
    path: ':id/nda',
    component: NdaComponent,
  },
  {
    path: ':id/activity-feed',
    component: ActivityFeedComponent,
  },
  {
    path: ':id/notarization',
    component: NotarizationComponent,
  },
  {
    path: ':id/sentnotarization',
    component: SentNotarizationComponent,
  },
  {
    path: ':id/viewnotarization',
    component: ViewnotarizationComponent,
  },
  /*  {
      path: ':id/task',
      loadChildren: 'app/founder/projects/details/task-dashboard/task-dashboard.module#TaskDashboardModule',
    },
    {
      path: ':id/operations',
      component: OperationsComponent,
      data: {
        allowEdit: true,
        routePrefix: ['founder', 'projects'],
      }
    },
    {
      path: ':id/collaboration',
      component: ProjectCollaborationComponent,
      children: [
        {path: 'activity-log', component: ActivityLogBotComponent, outlet: 'documents'},
        {path: 'activity-log/:empId', component: ActivityLogUserComponent, outlet: 'documents'},
        {path: 'goal/:goalId', component: CollaborationGoalProcessesComponent, outlet: 'documents'},
        {path: 'process/:processId', component: CollaborationProcessDocumentsComponent, outlet: 'documents'},
        {path: 'document/:documentId', component: CollaborationDocumentComponent, outlet: 'documents'},
        {path: 'chat/:processId', component: DocumentChatComponent, outlet: 'chat'},
        {path: 'public/channel', component: PublicChatRoomComponent, outlet: 'chat'},
        {path: 'lunch-room/:lunchRoomId', component: PublicChatRoomComponent, outlet: 'chat'},
      ],
    },
    {
      path: ':id/recruitment',
      component: FounderProjectRecruitmentComponent,
    },
    {
      path: ':id/recruitment/:empid/profile',
      component: EmployeeProfileComponent,
    },
    {
      path: ':id/recruitment/:empid/pay',
      component: EmployeePayComponent,
    },
    {
      path: ':id/recruitment/:empid/ProcessesWorkedOn',
      component: ProcessesWorkedOnComponent,
    },
    {
      path: ':id/recruitment/requests',
      component: RequestsComponent,
    },
    {
      path: ':id/budget',
      loadChildren: './budget/budget.module#BudgetModule',
    },
    {
      path: ':id/processesdue-soon',
      component: ProcessDueSoonComponent,
    }, */
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  // providers: [IsTemporaryUser]
})
export class FounderProjectsRoutingModule {
}
