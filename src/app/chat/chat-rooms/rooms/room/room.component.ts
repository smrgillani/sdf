import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'app/collaboration/chat.service';
import { ChatMessageModel, RocketChatUserInfo } from 'app/collaboration/models';
import UserProfileModel from 'app/core/models/UserProfileModel';
import { WebRTCService } from 'app/common/services/webRTC.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoomHandler } from '../../../chat-websocket/room-handler';
import { ChatWebsocketService } from '../../../chat-websocket/chat.websocket.service';
import { FileSentEvent, MessageSentEvent } from '../../../chat-partials/chat-action-bar/chat-action-bar.component';
import { AccountService } from 'app/founder/account/account.service';
import { environment } from '../../../../../environments/environment';
import { DeletePromptComponent } from 'app/elements/delete-prompt/delete-prompt.component';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit, OnDestroy {
  groupName = '';
  messages: ChatMessageModel[];
  editMessage: ChatMessageModel = null;
  showOnlyStarred = false;
  fileUploadErrors: string[] = [];
  private attachments: any[] = [];
  private chatUserInfo: RocketChatUserInfo;
  private webrtcChatRoom = false;
  private roomId;
  private debouncedStartTyping = _.debounce(this.startTyping, 500, {leading: true, trailing: false});
  private debouncedEndTyping = _.debounce(this.endTyping, 500);
  private roomHandler: RoomHandler;

  @ViewChild(PerfectScrollbarComponent) private scrollbar: PerfectScrollbarComponent;

  constructor(
    private chatService: ChatService,
    private chatWebsocketService: ChatWebsocketService,
    private route: ActivatedRoute,
    private webRTCService: WebRTCService,
    private accountService: AccountService,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.messages = [];
      this.roomId = params['roomId'];

      if (!this.roomHandler) {
        this.roomHandler = this.chatWebsocketService.createRoomHandler(this.roomId);
        this.roomHandler.updateMessages = this.updateMessages.bind(this);
        this.roomHandler.removeMessage = this.removeMessage.bind(this);
        this.roomHandler.usersList = this.chatService.usersList;
      }

      this.roomHandler.reset(this.roomId);

      this.getRoomMembers();
    });

    this.chatService.getChatCredentials().subscribe(credentials => {
      this.chatUserInfo = this.chatService.usersList[credentials.user_id];
    });

    this.updateMessages();
  }

  ngOnDestroy() {
    if (this.roomHandler) {
      this.roomHandler.destroy();
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
    return this.chatUserInfo && !!message.starred.find(item => item._id === this.chatUserInfo.id);
  }

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

  setEditMessage(message: ChatMessageModel) {
    this.editMessage = message;
  }

  deleteMessage(id: any, message: ChatMessageModel) {
    const modalRef = this.modalService.open(DeletePromptComponent, {
      windowClass: 'interviewmodel modal-dialog-centered',
    });

    modalRef.componentInstance.emitService.subscribe((emmitedValue) => { 
      modalRef.close();

      this.chatService.deleteMessage(id, this.roomId)
        .subscribe(() => {
          this.resetValues();
        });

      this.removeMessage(id);
    });
  }

  sendMessage(event: MessageSentEvent) {
    if (this.roomId) {
      const messageIdForEdit = this.editMessage ? this.editMessage.id : '';

      this.chatService
        .sendOrEditMessage(event.text, messageIdForEdit, this.roomId, event.type, this.attachments, '', null, null)
        .subscribe(() => {
          this.resetValues();
        });
    }
  }

  sendFile(event: FileSentEvent) {
    // this.sourceAttachment = event;
    this.chatService.postFormData(this.roomId, event.type, event.file).subscribe(response => {
      const body = response.json();

      if (body.success) {
        this.resetValues();
      } else {
        this.fileUploadErrors = [body.error];
      }
    });
  }

  startVideoCall() {
    this.webrtcChatRoom = !this.webrtcChatRoom;
    this.webRTCService.videoCallData.next({
      roomId: this.roomId,
      autoStart: true,
      incomingMessage: null,
    });
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

  private getRoomMembers() {
    this.chatService.getRoomMembers(this.roomId).subscribe((obj) => {
      console.log('getRoomMembers:', obj);
      this.groupName = obj.name != null ? obj.name : obj.username;
    });
  }

  private updateMessages() {
    return this.chatService.getProjectChatHistory(this.roomId)
      .subscribe(
        (messages) => {
          console.log('messages:', messages);
          this.loadMessages(messages);
          this.chatService.markRoomAsRead(this.roomId).subscribe(() => {
            this.accountService.fetchMessagesCount().subscribe();
          });
        });
  }

  private removeMessage(id: string) {
    const u = _.findIndex(this.messages, v => v.id === id);

    if (u >= 0) {
      this.messages.splice(u, 1);
    }
  }

  private loadMessages(messages: ChatMessageModel[]) {
    this.messages = _.orderBy(messages, 'time');
    const msgLength = this.messages.length;

    for (const message of this.messages) {
      if (message.attachments) {
        message.attachments.forEach((item) => {
          if (item.image_type && item.image_url) {
            item.image_preview = `data:${item.image_type};base64,${item.image_preview}`;
            item.image_url = `${environment.rocketchat_api}${item.image_url}`;
          } else if (item.message_link && msgLength !== 0) {
            const repliedId = item.message_link.split('msg=')[1];
            const msgData = messages.find(a => a.id === repliedId);
            const index = this.messages.findIndex(a => a.id === repliedId);
            msgData.user = this.messages[index].user;
            this.messages[index] = msgData;
          }
        });
      }
    }

    const tempUser = this.messages.filter((x, i, a) => x && a.findIndex(j => j.userId === x.userId) === i);

    for (const message of tempUser) {
      this.chatService.getChatUser(message.userId).subscribe((user) => {
        for (const message1 of this.messages.filter(a => a.userId === message.userId)) {
          message1.user = user;
        }
      });
    }

    setTimeout(() => {
      this.scrollbar.scrollToBottom();
    }, 0);
  }

  private resetValues() {
    this.editMessage = null;
    this.attachments = [];
    this.fileUploadErrors = [];
  }
}
