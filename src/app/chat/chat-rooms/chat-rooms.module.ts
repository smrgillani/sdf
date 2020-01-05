import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppElementsModule } from 'app/elements/elements.module';
import { ChatService } from 'app/collaboration/chat.service';
import { MyPrimeNgModule } from 'app/my-prime-ng.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NavbarModule } from 'app/core/navbar/navbar.module';
import { WebrtcModule } from 'app/webrtc/webrtc.module';
import { ChatApiService } from 'app/collaboration/chat.api.service';

import { RoomsComponent } from './rooms/rooms.component';
import { ChatRoomsRoutingModule } from './chat-rooms-routing';
import { RoomComponent } from './rooms/room/room.component';
import { ChatWebsocketModule } from '../chat-websocket/chat-websocket.module';
import { AppChatPartialsModule } from '../chat-partials/chat-partials.module';
import { AppPipesModule } from 'app/pipes/pipes.module';
import { CreateRoomComponent } from './rooms/create-room/create-room.component';

@NgModule({
  imports: [
    CommonModule,
    MyPrimeNgModule,
    FormsModule,
    NavbarModule,
    AppElementsModule,
    ChatRoomsRoutingModule,
    PerfectScrollbarModule.forRoot(),
    WebrtcModule,
    ChatWebsocketModule,
    AppPipesModule,
    AppChatPartialsModule,
  ],
  declarations: [
    CreateRoomComponent,
    RoomsComponent,
    RoomComponent,
  ],
  providers: [
    ChatApiService,
    ChatService,
  ],
})
export class ChatRoomsModule {
}
