import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy, AfterViewChecked, Input, ElementRef } from '@angular/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import * as _ from 'lodash';

import { ChatService } from 'app/collaboration/chat.service';
import {
  ChatRoomModel,
  ChatMessageModel,
  DecisionPollOption,
  RocketChatUserInfo,
} from 'app/collaboration/models';
import { environment } from 'environments/environment';
import { NewServiceModel } from 'app/founder/order-service/models/new-service-model';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'app/founder/order-service/services/order.service';
import { FileSentEvent, MessageSentEvent } from 'app/chat/chat-partials/chat-action-bar/chat-action-bar.component';
import { RoomHandler } from 'app/chat/chat-websocket/room-handler';
import { ChatWebsocketService } from 'app/chat/chat-websocket/chat.websocket.service';

@Component({
  selector: 'app-creator-chat',
  templateUrl: './creator-chat.component.html',
  styleUrls: ['./creator-chat.component.scss'],
})
export class CreatorChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  activeMobileView: null | 'chat' | 'menu' | 'documents' = 'chat';
  isProcessesOpen = false;
  isChatOpen = false;
  messages: ChatMessageModel[] = [];
  chatWidth = 300;
  editMessage: ChatMessageModel = null;
  showOnlyStarred = false;
  fileUploadErrors: string[] = [];
  private chatRoom: ChatRoomModel = null;
  private chatUserId: string;
  private chatUserInfo: RocketChatUserInfo;
  private attachments: any[] = [];
  private parent_message_id = '';
  private roomHandler: RoomHandler;
  private debouncedStartTyping = _.debounce(this.startTyping, 500, {leading: true, trailing: false});
  private debouncedEndTyping = _.debounce(this.endTyping, 500);

  @Input() orderServiceInfo: NewServiceModel;
  @Input() private order: number;

  @ViewChild(PerfectScrollbarComponent) private scrollbar: PerfectScrollbarComponent;
  @ViewChild('process_details') private processDetails: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private chatService: ChatService,
    private chatWebsocketService: ChatWebsocketService,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.chatService.getChatRoomByServiceId(this.order).subscribe(chatRoom => {
      this.resetValues();
      this.chatRoom = chatRoom;

      if (!this.roomHandler) {
        this.roomHandler = this.chatWebsocketService.createRoomHandler(this.chatRoom.room_id);
        this.roomHandler.updateMessages = this.updateMessages.bind(this);
        // this.roomHandler.removeMessage = this.removeMessage.bind(this);
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

  getOrderServiceInfo() {
    this.orderService.getOrderServiceInfo(this.order).subscribe((info: any) => {
      this.orderServiceInfo = info;
    });
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

  openChat() {
    this.isChatOpen = !this.isChatOpen;
    setTimeout(() => {
      this.scrollbar.directiveRef.scrollToBottom();
    }, 1);
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

  private loadMessages(messages: ChatMessageModel[]) {
    const temp = _.orderBy(messages, 'time');
    const msgLength = this.messages.length;

    if (this.messages && this.messages.length !== temp.length) {
      const newMessages = _.filter(
        temp, x => !_.find(this.messages, q => q.id === x['id']),
      );

      for (const newMessage of newMessages) {
        if (newMessage.attachments) {
          newMessage.attachments.forEach((item) => {
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
        this.messages.push(newMessage);
      }

      setTimeout(() => {
        this.scrollbar.directiveRef.scrollToBottom();
      }, 1);
    } else {
      for (let index = 0; index < temp.length; index++) {
        if (this.messages && this.messages[index] && this.messages[index].message_type === 'decision_poll'
          && !this.messages[index].is_reply && this.messages[index].userId !== this.chatUserId) {
          this.messages[index].is_reply = temp[index].is_reply;
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
      '', decisionPollOptions, this.parent_message_id).subscribe(() => {
      if (messageIdForEdit) {
        this.editMessage = null;
      }
      this.resetValues();
    });
  }

  private updateMessages() {
    return this.chatService.getChatHistoryForService(this.chatRoom.room_id, this.isChatOpen)
      .subscribe(messages => {
        this.loadMessages(messages);
      });
  }

  private resetValues() {
    this.editMessage = null;
    this.parent_message_id = '';
    this.attachments = [];
    this.fileUploadErrors = [];
  }
}
