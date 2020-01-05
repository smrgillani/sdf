import { NgModule } from '@angular/core';
import { PublicChatRoomComponent } from './public-chat-room/public-chat-room.component';
import { CommonModule } from '@angular/common';
import { AppElementsModule } from 'app/elements/elements.module';
import { AppPipesModule } from 'app/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { AppChatPartialsModule } from 'app/chat/chat-partials/chat-partials.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CollaborationComponent } from './collaboration/collaboration.component';
import { NgbCollapseModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { MyPrimeNgModule } from 'app/my-prime-ng.module';
import { DocumentTypeFilterComponent } from './document-explorer/document-type-filter/document-type-filter.component';
import { ChatApiService } from './chat.api.service';
import { ChatService } from './chat.service';
import { WebrtcModule } from 'app/webrtc/webrtc.module';
import { CommonUiModule } from 'app/common-ui/common-ui.module';
import { ChatMessagesListComponent } from './chat-messages-list/chat-messages-list.component';
import { ChatWebsocketModule } from 'app/chat/chat-websocket/chat-websocket.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PerfectScrollbarModule.forChild(),
    AppElementsModule,
    AppPipesModule,
    NgbCollapseModule,
    NgbPopoverModule,
    RouterModule,
    MyPrimeNgModule,
    WebrtcModule,
    AppChatPartialsModule,
    CommonUiModule,
    ChatWebsocketModule,
  ],
  declarations: [
    CollaborationComponent,
    PublicChatRoomComponent,
    DocumentTypeFilterComponent,
    ChatMessagesListComponent,
  ],
  exports: [
    CollaborationComponent,
    PublicChatRoomComponent,
    ChatMessagesListComponent,
  ],
  providers: [
    ChatApiService,
    ChatService,
  ]
})
export class AppCollaborationModule {
}
