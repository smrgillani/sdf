import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { environment } from '../../../environments/environment';
import { WebsocketWrapper } from 'app/common/websocket-utils/websocket-wrapper';
import { ChatCredentialsModel, RocketChatWebSocketResponse } from 'app/collaboration/models';
import { ChatService } from 'app/collaboration/chat.service';

import { RoomHandler } from './room-handler';

const userStatuses = ['offline', 'online', 'away', 'busy'];

@Injectable()
export class ChatWebsocketService {
  protected websocket: WebsocketWrapper;

  constructor(
    private chatService: ChatService,
  ) {
  }

  next(value: any) {
    this.websocket.next(value);
  }

  subscribe(next: any): Subscription {
    return this.websocket.subscribe(next);
  }

  createChatWebSocket() {
    if (this.websocket === undefined) {
      this.websocket = new WebsocketWrapper(environment.rocketChatWebSocket);

      this.chatService.getChatCredentials().subscribe(credentials => {
        this.websocket.subscribe((response: MessageEvent) => {
          const responseData = JSON.parse(response.data) as RocketChatWebSocketResponse;

          this.handleWebSocketResponse(responseData, credentials);
        });

        this.websocket.next({
          msg: 'connect',
          version: '1',
          support: ['1'],
        });
      });
    }
  }

  destroyChatWebSocket() {
    if (this.websocket !== undefined) {
      this.websocket.close();
      this.websocket = undefined;
    }
  }

  createRoomHandler(roomId: string) {
    return new RoomHandler(roomId, this.websocket);
  }

  protected handleWebSocketResponse(
    responseData: RocketChatWebSocketResponse,
    credentials: ChatCredentialsModel,
  ) {
    const logInMethodId = 'method-login';

    switch (responseData.msg) {
      case 'connected':
        // WebSocket connected successfully
        // this.chatWebSocketIsConnected = true;

        this.websocket.next({
          msg: 'method',
          method: 'login',
          id: logInMethodId,
          params: [{
            resume: credentials.token,
          }],
        });
        break;
      case 'result':
        // Result from methods handling
        if (responseData.id === logInMethodId) {
          // Logged in
          this.chatService.reloadUsersList().subscribe(() => {
            this.websocket.next({
              msg: 'sub',
              id: 'stream-notify-logged',
              name: 'stream-notify-logged',
              params: ['user-status', false],
            });
          });
        }
        break;
      case 'ping':
        // Keeps connection alive
        this.websocket.next({
          msg: 'pong',
        });
        break;
      case 'changed':
        if (responseData.collection === 'stream-notify-logged') {
          if (responseData.fields.eventName === 'user-status') {
            responseData.fields.args.forEach(([userId, , status]: [string, string, number]) => {
              this.chatService.setUserPresence(userId, userStatuses[status]);
            });
          }
        }
        break;
    }
  }
}
