import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyProjectsComponent } from './overview/overview.component';
import { MyProjectsSummaryComponent } from 'app/backer/my-projects/summary/summary.component';
import { CollaborationComponent } from 'app/backer/my-projects/collaboration/collaboration.component';
import { CollaborationGoalProcessesComponent } from 'app/backer/my-projects/collaboration/goal-processes/goal-processes.component';
import { CollaborationProcessDocumentsComponent } from 'app/backer/my-projects/collaboration/process-documents/process-documents.component';
import { CollaborationDocumentComponent } from 'app/backer/my-projects/collaboration/document/document.component';
import { DocumentChatComponent } from 'app/backer/my-projects/collaboration/chat/chat.component';
import { BackerProjectDetailsComponent } from './backer-project-details/backer-project-details.component';
import { BackerActivityFeedComponent } from './backer-project-details/backer-activity-feed/backer-activity-feed.component';
import { BackerProcessDueSoonComponent } from './backer-project-details/backer-process-due-soon/backer-process-due-soon.component';
import { BackerRecruitmentComponent } from './backer-recruitment/backer-recruitment.component';
import { BackerEmployeeProfileComponent } from './backer-employee-profile/backer-employee-profile.component';
import { PublicChatRoomComponent } from '../../collaboration/public-chat-room/public-chat-room.component';
import { ActivityLogUserComponent } from './collaboration/activity-log-user/activity-log-user.component';
import { ActivityLogBotComponent } from './collaboration/activity-log-bot/activity-log-bot.component';
import { OperationsComponent } from 'app/projects/operations/operations.component';


const routes: Routes = [
  {
    path: '',
    component: MyProjectsComponent,
  },
  {
    path: ':id',
    component: BackerProjectDetailsComponent,
  },
  {
    path: ':id/operations',
    component: OperationsComponent,
    data: {
      allowEdit: false,
      routePrefix: ['backer', 'my-projects'],
    }
  },
  {
    path: ':id/recruitment',
    component: BackerRecruitmentComponent,
  },
  {
    path: ':id/recruitment/:empid/profile',
    component: BackerEmployeeProfileComponent,
  },
  {
    path: ':id/boards/:milestoneId', // app\backer\my-projects\backer-project-operations
    loadChildren: 'app/backer/my-projects/backer-kanbanboard/backer-kanbanboard.module#BackerKanbanboardModule',
  },
  {
    path: ':id/activity-feed',
    component: BackerActivityFeedComponent,
  },
  {
    path: ':id/processesdue-soon',
    component: BackerProcessDueSoonComponent,
  },
  {
    path: ':id/summary',
    component: MyProjectsSummaryComponent,
  },
  {
    path: ':id/collaboration',
    component: CollaborationComponent,
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
    path: ':id/budget',
    loadChildren: './backer-budget/backer-budget.module#BackerBudgetModule',
  },
  {
    path: ':id/services',
    loadChildren: 'app/backer/my-projects/order-service/backer-order-service.module#BackerOrderServiceModule',
  },
  // {
  //  path: ':id/projectmessage',
  //  component: ProjectMessageComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackerMyProjectsRoutingModule {
}
