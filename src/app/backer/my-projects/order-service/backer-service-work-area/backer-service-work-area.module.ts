import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCollapseModule, NgbPopoverModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FileDroppa } from 'file-droppa/lib/index';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';

import { SpreadSheetModule } from 'app/elements/spreadsheet/spreadsheet.module';
import { AppElementsModule } from 'app/elements/elements.module';
import { WebrtcModule } from 'app/webrtc/webrtc.module';
import { AppPipesModule } from 'app/pipes/pipes.module';
import { MyPrimeNgModule } from 'app/my-prime-ng.module';

import { OrderService } from 'app/founder/order-service/services/order.service';


import { ProjectCollaborationModule } from 'app/founder/projects/collaboration/collaboration.module';
import { BackerServiceWorkAreaComponent } from './backer-service-work-area.component';
import { BackerServicesDocumentsComponent } from './backer-services-documents/backer-services-documents.component';
import { BackerServiceWorkAreaRoutingModule } from './backer-service-work-area.routing.module';
import { BackerServiceDocumentComponent } from './backer-service-document/backer-service-document';

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
    ProjectCollaborationModule,
    BackerServiceWorkAreaRoutingModule
  ],
  declarations: [
    BackerServiceWorkAreaComponent,
    BackerServiceDocumentComponent,
    BackerServicesDocumentsComponent,
  ],
  exports: [BackerServiceWorkAreaComponent],
  providers: [OrderService]
})
export class BackerServiceWorkAreaModule { }