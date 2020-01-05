import { NgModule } from '@angular/core';
import { ChatWebsocketService } from './chat.websocket.service';

@NgModule({
  providers: [
    ChatWebsocketService,
  ]
})
export class ChatWebsocketModule {
}
