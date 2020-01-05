import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import {
  DecisionPollOption,
  ChatRoomModel,
  ChatMessageModel,
  RocketChatUserInfo,
} from 'app/collaboration/models';
import { ChatService } from 'app/collaboration/chat.service';
import { environment } from 'environments/environment';
import UserProfileModel from 'app/core/models/UserProfileModel';
import { switchMap } from 'rxjs/operators';
import { ChatWebsocketService } from '../../chat/chat-websocket/chat.websocket.service';
import { RoomHandler } from 'app/chat/chat-websocket/room-handler';
import { FileSentEvent, MessageSentEvent } from 'app/chat/chat-partials/chat-action-bar/chat-action-bar.component';

@Component({
  selector: 'app-public-chat-room',
  templateUrl: './public-chat-room.component.html',
  styleUrls: ['./public-chat-room.component.scss'],
})
export class PublicChatRoomComponent implements OnInit, OnDestroy, AfterViewChecked {
  activeMobileView: null | 'chat' | 'menu' | 'documents';
  isProcessesOpen = false;
  isChatOpen = true;
  chatRoom: ChatRoomModel;
  messages: ChatMessageModel[] = [];
  chatWidth = 300;
  editMessage: ChatMessageModel = null;
  showOnlyStarred = false;
  fileUploadErrors: string[] = [];
  private attachments: any[] = [];
  private chatUserId: string;
  private chatUserInfo: RocketChatUserInfo;
  private projectId: number;
  private readonly messagesUser: _.Dictionary<UserProfileModel> = {};
  private lunchRoomId: number;
  private roomHandler: RoomHandler;
  private debouncedStartTyping = _.debounce(this.startTyping, 500, {leading: true, trailing: false});
  private debouncedEndTyping = _.debounce(this.endTyping, 500);

  @ViewChild(PerfectScrollbarComponent) private scrollbar: PerfectScrollbarComponent;
  @ViewChild('process_details') private processDetails: ElementRef;

  constructor(
    private cdr: ChangeDetectorRef,
    private chatService: ChatService,
    private chatWebsocketService: ChatWebsocketService,
    private route: ActivatedRoute,
  ) {
    this.projectId = parseInt(this.route.parent.url['value'][0].path);
    this.lunchRoomId = this.route.snapshot.params['lunchRoomId'] ? parseInt(this.route.snapshot.params['lunchRoomId']) : undefined;
  }

  ngOnInit() {
    this.chatService.clearProfileCache();

    this.route.params.pipe(
      switchMap(routeParams => {
        this.chatRoom = undefined;
        this.messages = [];
        this.projectId = parseInt(this.route.parent.url['value'][0].path);
        this.lunchRoomId = routeParams.lunchRoomId ? parseInt(routeParams.lunchRoomId) : undefined;

        return this.chatService.getLunchRoomInfo(this.lunchRoomId, this.projectId);
      }),
    ).subscribe(chatRoom => {
      this.chatRoom = chatRoom;

      if (!this.roomHandler) {
        this.roomHandler = this.chatWebsocketService.createRoomHandler(this.chatRoom.room_id);
        this.roomHandler.updateMessages = this.updateMessages.bind(this);
        this.roomHandler.removeMessage = this.removeMessage.bind(this);
        this.roomHandler.usersList = this.chatService.usersList;
      }

      this.roomHandler.reset(this.chatRoom.room_id);
    });

    this.chatService.getChatCredentials().subscribe(credentials => {
      this.chatUserId = credentials.user_id;

      this.chatUserInfo = this.chatService.usersList[credentials.user_id];
    });
  }

  ngOnDestroy() {
    if (this.roomHandler) {
      this.roomHandler.destroy();


      if (this.chatRoom && this.chatUserInfo) {
        this.endTyping();
      }
    }
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  setEditMessage(message: ChatMessageModel) {
    this.editMessage = message;
  }

  deleteMessage(id: string) {
    this.chatService.deleteMessage(id, this.chatRoom.room_id)
      .subscribe(() => {
        this.resetValues();
      });
  }

  sendMessage(event: MessageSentEvent) {
    if (this.chatRoom) {
      this.sendMsg(event.text, event.type, event.options);
    }
  }

  starToggle(message: ChatMessageModel) {
    if (this.isStarred(message)) {
      this.chatService.unStarMessage(message.id).subscribe();
    } else {
      this.chatService.starMessage(message.id).subscribe();
    }
  }

  isStarred(message: ChatMessageModel) {
    return !!message.starred.find(item => item._id === this.chatUserId);
  }

  // TODO: implement on the backend field full_name for user profile
  getUsername(user: UserProfileModel) {
    if (!user) {
      return '';
    }

    if (user.first_name || user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }

    if (user.email) {
      return user.email;
    }

    if (user.phone_number) {
      return user.phone_number;
    }
  }

  sendFile(event: FileSentEvent) {
    // this.sourceAttachment = event;
    this.chatService.postFormData(this.chatRoom.room_id, event.type, event.file).subscribe(response => {
      const body = response.json();

      if (body.success) {
        this.resetValues();
      } else {
        this.fileUploadErrors = [body.error];
      }
    });
  }

  setChatWidth(width) {
    if (width < 300) {
      if (width < 29) {
        this.chatWidth = 0;
        this.isProcessesOpen = true;
      } else if (this.isProcessesOpen === false) {
        this.chatWidth = 300;
      }
    } else {
      this.chatWidth = width;
      this.isProcessesOpen = false;
    }
  }

  fixChatWidth(moved?: boolean) {
    if (moved === false) {
      this.setChatWidth(this.chatWidth === 0 ? 300 : 0);
    } else if (this.chatWidth > this.processDetails.nativeElement.offsetWidth) {
      this.chatWidth = this.processDetails.nativeElement.offsetWidth;
    }
  }

  onTypingOccurred() {
    this.debouncedStartTyping();
    this.debouncedEndTyping();
  }

  onTypingStarted() {
    this.debouncedStartTyping();
  }

  onTypingEnded() {
    this.debouncedEndTyping();
  }

  onChatFiltersChanged(filters: _.Dictionary<any>) {
    this.showOnlyStarred = filters['starred'];
  }

  private startTyping() {
    if (this.chatUserInfo) {
      this.debouncedEndTyping.cancel();
      this.roomHandler.setTypingStatus(this.chatUserInfo.username, true);
    }
  }

  private endTyping() {
    if (this.chatUserInfo) {
      this.roomHandler.setTypingStatus(this.chatUserInfo.username, false);
    }
  }

  private updateMessages() {
    return this.chatService.getChatHistory(this.chatRoom.room_id, this.isChatOpen)
      .subscribe(messages => {
        this.loadMessages(messages);
      });
  }

  private removeMessage(id: string) {
    const u = _.findIndex(this.messages, (v) => v.id === id);

    if (u >= 0) {
      this.messages.splice(u, 1);
    }
  }

  private loadMessages(messages: ChatMessageModel[]) {
    const temp = _.orderBy(messages, 'time');
    const msgLength = this.messages.length;

    if (this.messages && this.messages.length !== temp.length) {
      const narray = _.filter(
        temp, (x) => !_.find(this.messages, (q) => q.id === x['id']),
      );

      for (const msg of narray) {
        if (msg.attachments) {
          msg.attachments.forEach((item) => {
            if (item.image_type && item.image_url) {
              item.image_preview = `data:${item.image_type};base64,${item.image_preview}`;
              item.image_url = `${environment.rocketchat_api}${item.image_url}`;
            } else if (item.message_link && msgLength !== 0) {
              const repliedId = item.message_link.split('msg=')[1];
              const msgData = temp.find(a => a.id === repliedId);
              const index = this.messages.findIndex(a => a.id === repliedId);
              msgData.user = this.messages[index].user;
              this.messages[index] = msgData;
            }
          });
        }

        this.setMessageUser(msg);
        this.messages.push(msg);
      }

      setTimeout(() => {
        this.scrollbar.scrollToBottom();
      }, 0);
    } else {
      for (let index = 0; index < temp.length; index++) {
        if (this.messages && this.messages[index]) {
          if (this.messages[index].message_type === 'decision_poll' && !this.messages[index].is_reply
            && this.messages[index].userId !== this.chatUserId.toString()) {
            this.messages[index].is_reply = temp[index].is_reply;
          }

          this.messages[index].starred = temp[index].starred;
        }
      }

      const narray = _.filter(
        temp, (x) => !_.find(this.messages, (q) => q.text === x['text']),
      );

      for (const msg of narray) {
        const orignalMsg = _.find(this.messages, (q) => q.id === msg.id);
        orignalMsg.text = msg.text;
      }
    }
  }

  private sendMsg(text: string, messageType = '', decisionPollOptions: DecisionPollOption[] = []) {
    const messageIdForEdit = this.editMessage ? this.editMessage.id : '';

    this.chatService.sendOrEditMessage(text, messageIdForEdit, this.chatRoom.room_id, messageType, this.attachments,
      '', decisionPollOptions, null).subscribe(() => {
      if (messageIdForEdit) {
        this.editMessage = null;
      }
      this.resetValues();
    });
  }

  private setMessageUser(msg: ChatMessageModel) {
    if (this.messagesUser.hasOwnProperty(msg.userId) && this.messagesUser[msg.userId]) {
      msg.user = this.messagesUser[msg.userId];
    } else {
      this.chatService.getChatUser(msg.userId).subscribe(user => {
        msg.user = user;

        this.messagesUser[msg.userId] = user;
      });
    }
  }

  private resetValues() {
    this.editMessage = null;
    this.attachments = [];
    this.fileUploadErrors = [];
  }
}
