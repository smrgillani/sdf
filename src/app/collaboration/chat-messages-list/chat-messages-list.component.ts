import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {
  AttachmentMessageModel,
  ChatMessageModel,
  ChatRoomModel,
  DecisionPollOption,
  RocketChatUserInfo,
} from '../models';
import UserProfileModel from 'app/core/models/UserProfileModel';
import { ChatService } from '../chat.service';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { FileSentEvent, MessageSentEvent } from 'app/chat/chat-partials/chat-action-bar/chat-action-bar.component';
import { environment } from '../../../environments/environment';
import * as _ from 'lodash';
import { RoomHandler } from 'app/chat/chat-websocket/room-handler';
import { ChatWebsocketService } from 'app/chat/chat-websocket/chat.websocket.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-chat-messages-list',
  templateUrl: './chat-messages-list.component.html',
  styleUrls: ['./chat-messages-list.component.scss'],
})
export class ChatMessagesListComponent implements OnInit, OnChanges, OnDestroy {
  messageText: string;
  messages: ChatMessageModel[] = [];
  showOnlyStarred = false;
  chatUserId: string;
  editMessage: ChatMessageModel = null;
  fileUploadErrors: string[] = [];
  private popoverTimerList = {};
  private chatUserInfo: RocketChatUserInfo;
  private messagesUser: { msgUserId: string, user: UserProfileModel }[] = [];
  private debouncedStartTyping = _.debounce(this.startTyping, 500, {leading: true, trailing: false});
  private debouncedEndTyping = _.debounce(this.endTyping, 500);
  private parent_message_id = '';
  private roomHandler: RoomHandler;
  private attachments: any[] = [];

  @ViewChild(PerfectScrollbarComponent) private scrollbar: PerfectScrollbarComponent;

  @Input() overDoubleWidth: boolean;
  @Input() private chatRoom: ChatRoomModel = null;
  @Input() private isChatOpen = false;
  @Input() private filters: _.Dictionary<any>;

  constructor(
    private chatService: ChatService,
    private chatWebsocketService: ChatWebsocketService,
  ) {
  }

  ngOnInit() {
    this.messages = [];
    this.resetValues();

    this.chatService.getChatCredentials().subscribe(credentials => {
      this.chatUserId = credentials.user_id;

      this.chatUserInfo = this.chatService.usersList[credentials.user_id];
    });

    if (!this.roomHandler) {
      this.roomHandler = this.chatWebsocketService.createRoomHandler(this.chatRoom.room_id);
      this.roomHandler.updateMessages = this.updateMessages.bind(this);
      this.roomHandler.removeMessage = this.removeMessage.bind(this);
      this.roomHandler.usersList = this.chatService.usersList;
    }

    this.roomHandler.reset(this.chatRoom.room_id);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.roomHandler && changes.chatRoom) {
      this.roomHandler.reset(changes.chatRoom.currentValue.room_id);
    }

    if (changes.filters && changes.filters.currentValue) {
      this.showOnlyStarred = changes.filters.currentValue['starred'];
    }

    if (changes.isChatOpen && changes.isChatOpen.currentValue === true) {
      setTimeout(() => {
        this.scrollbar.scrollToBottom();
      }, 0);
    }
  }

  ngOnDestroy() {
    if (this.roomHandler) {
      this.roomHandler.destroy();

      if (this.chatRoom && this.chatUserInfo) {
        this.endTyping();
      }
    }
  }

  sendMessage(event: MessageSentEvent) {
    if (this.chatRoom) {
      this.sendMsg(event.text, event.type, event.options);
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

  deleteMessage(id: any) {
    this.chatService.deleteMessage(id, this.chatRoom.room_id)
      .subscribe(() => {
        this.resetValues();
      });
  }

  postADR(messageText: string, message: ChatMessageModel, popover, subpopover?) {
    this.parent_message_id = message.id;

    const data = {
      text: message.text,
      author_name: message.username,
      ts: message.time,
      message_link: `${environment.rocketchat_api}/group/${this.chatRoom.title}?msg=${message.id}`,
      translations: null,
    } as AttachmentMessageModel;

    this.attachments.push(data);
    this.sendMsg(messageText);

    if (subpopover) {
      subpopover.close();
    }

    popover.close();
  }

  selectedPollOption(id: number, message: ChatMessageModel) {
    this.chatService.postSelectedPollOption({message_id: message.id, options: id}).subscribe((obj) => {
      this.resetValues();
      // this.updateMessages(); // todo: check if websocket supports it
    });
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

  closePopoverpWithDelay(timer: number, popoverId: NgbPopover, timerName, parentPopoverId?) {
    clearTimeout(this.popoverTimerList[timerName]);
    this.popoverTimerList[timerName] = setTimeout(() => {
      popoverId.close();

      if (parentPopoverId) {
        parentPopoverId.close();
      }
    }, timer);
  }

  setDataForResponse(message: ChatMessageModel, popover) {
    popover.open();
  }

  setEditMessage(message: ChatMessageModel) {
    this.editMessage = message;
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

  private sendMsg(text: string, messageType = '', decisionPollOptions: DecisionPollOption[] = []) {
    const messageIdForEdit = this.editMessage ? this.editMessage.id : '';

    this.chatService.sendOrEditMessage(text, messageIdForEdit, this.chatRoom.room_id, messageType, this.attachments,
      '', decisionPollOptions, this.parent_message_id).subscribe(() => {
      if (messageIdForEdit) {
        this.editMessage = null;
      }
      this.resetValues();
    });
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
    const initialMessagesLength = this.messages.length;
    const hasNewMessages = this.messages && this.messages.length !== temp.length;

    if (hasNewMessages) {
      const newMessages = _.filter(
        temp, (x) => !_.find(this.messages, (q) => q.id === x['id']),
      );

      for (const newMessage of newMessages) {
        if (newMessage.attachments) {
          newMessage.attachments.forEach((item) => {
            if (item.image_type && item.image_url) {
              item.image_preview = `data:${item.image_type};base64,${item.image_preview}`;
              item.image_url = `${environment.rocketchat_api}${item.image_url}`;
            } else if (item.message_link && initialMessagesLength !== 0) {
              const repliedId = item.message_link.split('msg=')[1];
              const msgData = temp.find(a => a.id === repliedId);
              const index = this.messages.findIndex(a => a.id === repliedId);
              msgData.user = this.messages[index].user;
              this.messages[index] = msgData;
            }
          });
        }

        this.getMessageUser(newMessage);
        this.messages.push(newMessage);
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

          if (this.messages[index].message_type === 'opinion') {
            this.messages[index].is_reply = temp[index].is_reply;
            this.messages[index].agree_count = temp[index].agree_count;
            this.messages[index].diagree_count = temp[index].diagree_count;
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

      const narrayOptions = _.filter(
        temp, (x) => !_.find(this.messages, (q) => q.options === x['options']),
      );

      for (const msg of narrayOptions) {
        const orignalMsg = _.find(this.messages, (q) => q.id === msg.id);
        orignalMsg.options = msg.options;
      }
    }
  }

  private getMessageUser(msg: ChatMessageModel) {
    const u = _.find(this.messagesUser, (v) => v.msgUserId === msg.userId);

    if (u) {
      msg.user = u.user;
    } else {
      this.chatService.getChatUser(msg.userId).subscribe((user) => {
        this.messagesUser.push({msgUserId: msg.userId, user: user});
        msg.user = user;
      });
    }
  }

  private resetValues() {
    this.editMessage = null;
    this.parent_message_id = '';
    this.attachments = [];
    this.fileUploadErrors = [];
  }
}
