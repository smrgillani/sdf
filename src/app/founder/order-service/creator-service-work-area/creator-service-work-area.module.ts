import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCollapseModule, NgbPopoverModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FileDroppa } from 'file-droppa/lib/index';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { SpreadSheetModule } from 'app/elements/spreadsheet/spreadsheet.module';
import { AppElementsModule } from 'app/elements/elements.module';
import { WebrtcModule } from 'app/webrtc/webrtc.module';
import { AppPipesModule } from 'app/pipes/pipes.module';
import { MyPrimeNgModule } from 'app/my-prime-ng.module';

import { OrderService } from 'app/founder/order-service/services/order.service';
import { CreatorServiceWorkAreaComponent } from 'app/founder/order-service/creator-service-work-area/creator-service-work-area.component';
import {
  ServicesDocumentsComponent,
} from 'app/founder/order-service/creator-service-work-area/services-documents/services-documents.component';
import { ServiceDocumentComponent } from 'app/founder/order-service/creator-service-work-area/service-document/service-document.component';
import { StopTimerComponent } from 'app/founder/order-service/creator-service-work-area/services-documents/stop-timer/stop-timer.component';
import { CreatorChatComponent } from './creator-chat/creator-chat.component';
import { ProjectCollaborationModule } from 'app/founder/projects/collaboration/collaboration.module';
import { AppChatPartialsModule } from 'app/chat/chat-partials/chat-partials.module';
import { CommonUiModule } from 'app/common-ui/common-ui.module';

@NgModule({
  imports: [
    CommonModule,
    AppElementsModule,
    WebrtcModule,
    AppPipesModule,
    NgbCollapseModule,
    NgbPopoverModule,
    NgbTypeaheadModule,
    FormsModule,
    RouterModule,
    SpreadSheetModule,
    FileDroppa,
    PerfectScrollbarModule.forChild(),
    MyPrimeNgModule,
    AppChatPartialsModule,
    ProjectCollaborationModule,
    CommonUiModule,
  ],
  declarations: [
    CreatorServiceWorkAreaComponent,
    ServicesDocumentsComponent,
    ServiceDocumentComponent,
    StopTimerComponent,
    CreatorChatComponent,
  ],
  exports: [CreatorServiceWorkAreaComponent],
  entryComponents: [
    StopTimerComponent,
  ],
  providers: [
    OrderService,
  ],
})
export class CreatorServiceWorkAreaModule {
}
