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

import {
  EmployeeServiceWorkAreaComponent
} from 'app/employee/account/project-list/employee-service-work-area/employee-service-work-area.component';
import {
  ServiceDocumentComponent
} from 'app/employee/account/project-list/employee-service-work-area/service-document/service-document.component';
import { ServicesDocumentsComponent } from './services-documents/services-documents.component';
import {
  StopTimerComponent
} from 'app/employee/account/project-list/employee-service-work-area/services-documents/stop-timer/stop-timer.component';
import { OrderService } from 'app/founder/order-service/services/order.service';
import { CollaborationModule } from '../../collaboration/collaboration.module';
import { EmployeeChatComponent } from './employee-chat/employee-chat.component';
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
    CollaborationModule,
    CommonUiModule,
  ],
  declarations: [
    EmployeeServiceWorkAreaComponent,
    ServicesDocumentsComponent,
    ServiceDocumentComponent,
    StopTimerComponent,
    EmployeeChatComponent,
  ],
  exports: [EmployeeServiceWorkAreaComponent],
  entryComponents: [
    StopTimerComponent,
  ],
  providers: [
    OrderService,
  ],
})
export class EmployeeServiceWorkAreaModule {
}
