import { WebsocketWrapper } from 'app/common/websocket-utils/websocket-wrapper';
import { RocketChatUserInfo, RocketChatWebSocketResponse } from 'app/collaboration/models';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';

export class RoomHandler {
  updateMessages: () => {};
  removeMessage: (id: string) => {};
  chatTypingUsers: RocketChatUserInfo[] = [];
  usersList: _.Dictionary<RocketChatUserInfo> = {};

  protected websocket: WebsocketWrapper;
  protected subscription: Subscription;
  protected roomId: string;

  protected subRoomMessagesChangesMethodId: string;
  protected subRoomMessagesDeletesMethodId: string;
  protected subRoomTypingMethodId: string;

  protected chatWebsocketRoomMessagesChangesSubs: string[] = [];
  protected chatWebsocketRoomMessagesDeletesSubs: string[] = [];
  protected chatWebsocketRoomTypingSubs: string[] = [];

  constructor(roomId: string, websocket: WebsocketWrapper) {
    this.websocket = websocket;

    this.subscription = this.websocket.subscribe((response: MessageEvent) => {
      const responseData = JSON.parse(response.data) as RocketChatWebSocketResponse;

      this.handleWebSocketResponse(responseData);
    });
  }

  reset(roomId: string) {
    this.roomId = roomId;
    this.subRoomMessagesChangesMethodId = `sub-room-messages-${this.roomId}`;
    this.subRoomMessagesDeletesMethodId = `sub-room-deletes-${this.roomId}`;
    this.subRoomTypingMethodId = `sub-room-typing-${this.roomId}`;

    this.refreshRoomSubscriptions();
  }

  destroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setTypingStatus(username: string, isTyping = true) {
    if (this.websocket !== undefined) {
      this.websocket.next({
        msg: 'method',
        method: 'stream-notify-room',
        id: 'stream-notify-room-' + Date.now(),
        params: [
          `${this.roomId}/typing`,
          username,
          isTyping,
        ],
      });
    }
  }

  private refreshRoomSubscriptions() {
    this.chatWebsocketRoomMessagesChangesSubs.forEach(sub => {
      if (sub !== this.subRoomMessagesChangesMethodId) {
        this.websocket.next({
          msg: 'unsub',
          id: sub,
        });
      }
    });

    this.chatWebsocketRoomMessagesChangesSubs = this.chatWebsocketRoomMessagesChangesSubs
      .filter(item => item === this.subRoomMessagesChangesMethodId);

    this.chatWebsocketRoomMessagesDeletesSubs.forEach(sub => {
      if (sub !== this.subRoomMessagesDeletesMethodId) {
        this.websocket.next({
          msg: 'unsub',
          id: sub,
        });
      }
    });

    this.chatWebsocketRoomMessagesDeletesSubs = this.chatWebsocketRoomMessagesDeletesSubs
      .filter(item => item === this.subRoomMessagesDeletesMethodId);

    this.chatWebsocketRoomTypingSubs.forEach(sub => {
      if (sub !== this.subRoomTypingMethodId) {
        this.websocket.next({
          msg: 'unsub',
          id: sub,
        });
      }
    });

    this.chatWebsocketRoomTypingSubs = this.chatWebsocketRoomTypingSubs
      .filter(item => item === this.subRoomTypingMethodId);

    this.updateMessages();

    if (this.chatWebsocketRoomMessagesChangesSubs.length === 0) {
      this.websocket.next({
        msg: 'sub',
        id: this.subRoomMessagesChangesMethodId,
        name: 'stream-room-messages',
        params: [
          this.roomId,
          false,
        ],
      });
    }

    if (this.chatWebsocketRoomMessagesDeletesSubs.length === 0) {
      this.websocket.next({
        msg: 'sub',
        id: this.subRoomMessagesDeletesMethodId,
        name: 'stream-notify-room',
        params: [
          `${this.roomId}/deleteMessage`,
          false,
        ],
      });
    }

    if (this.chatWebsocketRoomTypingSubs.length === 0) {
      this.websocket.next({
        msg: 'sub',
        id: this.subRoomTypingMethodId,
        name: 'stream-notify-room',
        params: [
          `${this.roomId}/typing`,
          false,
        ],
      });
    }
  }

  private handleWebSocketResponse(responseData: RocketChatWebSocketResponse) {
    switch (responseData.msg) {
      case 'ready':
        // Subscription created
        responseData.subs.forEach(sub => {
          if (sub.indexOf('sub-room-messages') === 0) {
            this.chatWebsocketRoomMessagesChangesSubs.push(sub);
          } else if (sub.indexOf('sub-room-deletes') === 0) {
            this.chatWebsocketRoomMessagesDeletesSubs.push(sub);
          } else if (sub.indexOf('sub-room-typing') === 0) {
            this.chatWebsocketRoomTypingSubs.push(sub);
          }
        });
        break;
      case 'changed':
        // Something changed in subscribed streams
        switch (responseData.collection) {
          case 'stream-notify-logged':
            if (responseData.fields.eventName.indexOf('user-status') === 0) {
              responseData.fields.args.forEach(([, username, status]: [any, string, number]) => {

                if (status === 0) {
                  this.chatTypingUsers = this.chatTypingUsers.filter(item => item.username !== username);
                }
              });
            }
            break;
          case 'stream-room-messages':
            this.updateMessages();
            break;
          case 'stream-notify-room':
            if (responseData.fields.eventName.indexOf('/deleteMessage') > 0) { // exists and has msg id before
              responseData.fields.args.forEach(message => {
                this.removeMessage(message._id);
              });
            } else if (responseData.fields.eventName.indexOf('/typing') > 0) {
              const [username, status]: [string, number] = responseData.fields.args;

              const isAlreadyTyping = this.chatTypingUsers.find(item => item.username === username);

              if (status && !isAlreadyTyping) {
                for (const id in this.usersList) {
                  if (this.usersList.hasOwnProperty(id) && this.usersList[id].username === username) {
                    this.chatTypingUsers.push(this.usersList[id]);
                  }
                }
              } else if (!status && isAlreadyTyping) {
                this.chatTypingUsers = this.chatTypingUsers.filter(item => item.username !== username);
              }
            }
            break;
        }
        break;
    }
  }
}
