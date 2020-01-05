import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

import { FileDroppa } from 'file-droppa/lib/index';
import { ProjectsService } from 'app/projects/projects.service';
import { AppElementsModule } from 'app/elements/elements.module';
import { WebrtcModule } from 'app/webrtc/webrtc.module';
import { FolderNavigation } from 'app/elements/document-explorer/FolderNavigation';
import { DocumentsService } from 'app/projects/documents.service';
import { TasksService } from 'app/projects/tasks.service';

import { CollaborationComponent } from './collaboration.component';
import { DocumentChatComponent } from './chat/chat.component';
import { CollaborationDocumentComponent } from './document/document.component';
import { CollaborationGoalProcessesComponent } from './goal-processes/goal-processes.component';
import { CollaborationProcessDocumentsComponent } from './process-documents/process-documents.component';
import { SpreadSheetModule } from 'app/elements/spreadsheet/spreadsheet.module';
import { ChatParticipantsComponent } from './document-explorer/chat-participants/chat-participants.component';
import { StopTimerComponent } from './process-documents/stop-timer/stop-timer.component';
import { AppPipesModule } from 'app/pipes/pipes.module';
import { MyPrimeNgModule } from 'app/my-prime-ng.module';
import { ScreenRecordingComponent } from './process-documents/screen-recording/screen-recording.component';
import { ExtensionProcessComponent } from './extension-process/extension-process.component';
import { ActivityLogEmployeeComponent } from './activity-log-employee/activity-log-employee.component';
import { AppCollaborationModule } from 'app/collaboration/collaboration.module';
import { AppChatPartialsModule } from 'app/chat/chat-partials/chat-partials.module';
import { CommonUiModule } from 'app/common-ui/common-ui.module';
import {MetricesService} from '../../../projects/metrices.service';


@NgModule({
  imports: [
    CommonModule,
    AppElementsModule,
    WebrtcModule,
    AppPipesModule,
    NgbCollapseModule, // todo: remove?
    NgbTypeaheadModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SpreadSheetModule,
    FileDroppa,
    MyPrimeNgModule,
    AppChatPartialsModule,
    AppCollaborationModule,
    CommonUiModule,
  ],
  declarations: [
    CollaborationComponent,
    CollaborationDocumentComponent,
    CollaborationGoalProcessesComponent,
    CollaborationProcessDocumentsComponent,
    DocumentChatComponent,
    ChatParticipantsComponent,
    StopTimerComponent,
    ScreenRecordingComponent,
    ExtensionProcessComponent,
    ActivityLogEmployeeComponent,
  ],
  exports: [
    CollaborationComponent,
    StopTimerComponent,
    ScreenRecordingComponent,
    ExtensionProcessComponent,
  ],
  providers: [
    ProjectsService,
    DocumentsService,
    FolderNavigation,
    TasksService,
    MetricesService
  ],
  entryComponents: [
    StopTimerComponent,
  ],
})
export class CollaborationModule {
}
