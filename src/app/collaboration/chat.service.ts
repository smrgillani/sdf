import { Injectable } from '@angular/core';
import { Headers, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import * as moment from 'moment';

import UserProfileModel from 'app/core/models/UserProfileModel';

import { ChatCredentialsModel, ChatMessageModel, ChatRoomModel, RocketChatUserInfo } from './models';
import { flatMap, tap } from 'rxjs/operators';
import { ChatApiService } from './chat.api.service';
import { delayedRetry } from 'app/chat/chat-api/delayedRetry';

const retryDelay = 3000;
const retryMax = 10;

/**
 * Service for working with Rocket.Chat.
 */
@Injectable()
export class ChatService {
  readonly usersList: _.Dictionary<RocketChatUserInfo> = {};
  protected cachedCredentials: ChatCredentialsModel;
  protected cachedUsers: _.Dictionary<UserProfileModel> = {};

  constructor(
    private api: ChatApiService,
  ) {
    this.parseMessagesResponse = this.parseMessagesResponse.bind(this);
    this.mapMessageToChatMessage = this.mapMessageToChatMessage.bind(this);
  }

  /**
   * Get user credentials for connection to chat.
   *
   * @returns object with user_id and token to connect Rocket.Chat
   */
  getChatCredentials(): Observable<ChatCredentialsModel> {
    if (this.cachedCredentials) {
      return Observable.of(_.cloneDeep(this.cachedCredentials));
    }

    return this.api.getChatCredentials()
      .pipe(delayedRetry(retryDelay, retryMax))
      .map((credentials: ChatCredentialsModel) => {
        this.cachedCredentials = credentials;
        return _.cloneDeep(credentials);
      });
  }

  getChatUser(userId: string): Observable<UserProfileModel> {
    const cached = this.cachedUsers[userId];

    if (cached) {
      return Observable.of(_.cloneDeep(cached));
    }

    return this.api.getChatUser(userId).map(user => {
      this.cachedUsers[userId] = user.user;
      return _.cloneDeep(user.user);
    });
  }

  getRoomMembers(roomId): Observable<any> {
    return this.api.getRoomMembers(roomId);
  }

  /**
   * Get chat room information which refers to a sub-task.
   *
   * @param taskId - sub-task (process) identifier
   */
  getChatRoom(taskId): Observable<ChatRoomModel> {
    return this.api.getChatRoom(taskId);
  }

  /**
   * Get chat room information which refers to a service.
   *
   * @param serviceId - service (process) identifier
   */
  getChatRoomByServiceId(serviceId): Observable<ChatRoomModel> {
    return this.api.getChatRoomByServiceId(serviceId);
  }

  /**
   * Get chat room information which refers to a project.
   *
   * @param projectId - project (public) identifier
   */
  getPublicRoomId(projectId): Observable<ChatRoomModel> {
    return this.api.getPublicRoomId(projectId);
  }

  /**
   * Get chat room information which refers to a project.
   *
   * @param projectId, - project (public) identifier
   * @param lunchRoomId - lunchRoomId (public) identifier
   */
  getLunchRoomInfo(lunchRoomId, projectId): Observable<ChatRoomModel> {
    return this.api.getLunchRoomInfo(lunchRoomId, projectId);
  }

  /**
   * Send or edit a message to a chat room.
   *
   * @param message - message body
   * @param roomId - Rocket.Chat room id
   * @param messageId - message id for edit
   * @param messageType
   * @param attachments
   * @param emoji
   * @param decisionPollSelectedList
   * @param parentMessageId
   */
  sendOrEditMessage(
    message, messageId, roomId, messageType, attachments, emoji, decisionPollSelectedList, parentMessageId,
  ): Observable<any> {
    return this.getChatCredentials().flatMap(user => {
      const body = {
        header: {
          'X-Auth-Token': user.token,
          'X-User-Id': user.user_id.toString(),
        },
        text: message,
        roomId: roomId,
        message_type: messageType,
        attachments: attachments,
        emoji: emoji,
        parent_message_id: parentMessageId,
        options: decisionPollSelectedList,
      };

      if (messageId) {
        body['msgId'] = messageId;

        return this.api.updateMessage(body);
      } else {
        return this.api.sendMessage(body);
      }
    });
  }

  deleteMessage(messageId, roomId) {
    return this.getChatCredentials().flatMap(user => {
      const body = {
        header: {
          'X-Auth-Token': user.token,
          'X-User-Id': user.user_id.toString(),
        },
        roomId: roomId,
        msgId: messageId,
        delete: true,
      };

      return this.api.deleteMessage(body);
    });
  }

  /**
   * Get chat room history.
   *
   * @param roomId - Rocket.Chat room id
   * @param isChatOpen
   */
  getChatHistory(roomId, isChatOpen): Observable<ChatMessageModel[]> {
    return this.getChatCredentials()
      .flatMap(user => {
        const body = {
          header: {
            'X-Auth-Token': user.token,
            'X-User-Id': user.user_id.toString(),
          },
          roomId: roomId,
          is_read: isChatOpen,
        };

        return this.api.getChatHistory(body);
      })
      .map(this.parseMessagesResponse)
      .pipe(delayedRetry(3000, 10));
  }

  /**
   * Get chat room history for service.
   *
   * @param roomId - Rocket.Chat room id
   * @param isChatOpen
   */
  getChatHistoryForService(roomId, isChatOpen): Observable<ChatMessageModel[]> {
    return this.getChatCredentials()
      .flatMap(user => {
        const body = {
          header: {
            'X-Auth-Token': user.token,
            'X-User-Id': user.user_id.toString(),
          },
          roomId: roomId,
          is_read: isChatOpen,
        };

        return this.api.getChatHistoryForService(body);
      })
      .map(this.parseMessagesResponse)
      .pipe(delayedRetry(3000, 10));
  }

  getProjectChatHistory(roomId: any): Observable<ChatMessageModel[]> {
    return this.getChatCredentials()
      .flatMap(user => {
        const body = {
          header: {
            'X-Auth-Token': user.token,
            'X-User-Id': user.user_id.toString(),
          },
          roomId: roomId,
        };

        return this.api.getProjectChatHistory(body);
      })
      .map(this.parseMessagesResponse)
      .pipe(delayedRetry(3000, 10));
  }

  postFormData(roomId: any, messageType: any, data: any): Observable<any> {
    return this.getChatCredentials().flatMap(user => {
      const file2 = this.dataURLtoFile(data, 'drawing');
      const fd = new FormData();

      fd.append('file', file2);

      const headers = new Headers({
        'X-Auth-Token': user.token,
        'X-User-Id': user.user_id.toString(),
        'messageType': messageType,
        roomId: roomId,
      });

      return this.api.postFormData(fd, headers);
    });
  }

  postSelectedPollOption(data: any): Observable<any> {
    return this.api.postSelectedPollOption(data);
  }

  postUploadAttachment(messageType, messageText, sourceAttachment, room_id): Observable<any> {
    return this.getChatCredentials().flatMap(user => {
      const body = {
        header: {
          'X-Auth-Token': user.token,
          'X-User-Id': user.user_id.toString(),
        },
        text: messageText,
        roomId: room_id,
        message_type: messageType,
        file: sourceAttachment.file,
        filename: sourceAttachment.title,
      };

      return this.api.postUploadAttachment(body);
    });
  }

  postShowInterest(fundId): Observable<any> {
    return this.getChatCredentials().flatMap(user => {
      const body = {
        header: {
          'X-Auth-Token': user.token,
          'X-User-Id': user.user_id.toString(),
        },
        fund: fundId,
      };

      return this.api.postShowInterest(body);
    });
  }

  getAllChatRooms(): Observable<any[]> {
    return this.getChatCredentials().flatMap(user => {
      const options = <RequestOptionsArgs>{
        params: {
          'X-Auth-Token': user.token,
          'X-User-Id': user.user_id.toString(),
        },
      };

      return this.api.getAllChatRooms(options)
        .pipe(delayedRetry(retryDelay, retryMax))
        .map(response => response.json());
    });
  }

  postDirectRoom(project?: any, userId?: number): Observable<any> {
    return this.getChatCredentials().flatMap(user => {
      const body = JSON.stringify({
        header: {
          'X-Auth-Token': user.token,
          'X-User-Id': user.user_id.toString(),
        },
        project: project,
        userId: userId,
      });

      return this.api.postDirectRoom(body);
    });
  }

  getDirectMessagesCount(): Observable<any> {
    return this.getChatCredentials().pipe(flatMap(user => {
      const options = <RequestOptionsArgs>{
        params: {
          'X-Auth-Token': user.token,
          'X-User-Id': user.user_id.toString(),
        },
      };

      return this.api.getDirectRoomsCounters(options)
        .map(response => response.json());
    }));
  }

  clearProfileCache() {
    this.cachedCredentials = null;
    this.cachedUsers = {};
  }

  /**
   * @param taskGroupId
   * @param startPage
   * @param pageSize
   * @returns list of all activities for taskGroup
   */
  getTaskGroupActivity(taskGroupId: number, startPage?, pageSize?): Observable<any> {
    let params;

    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      params = {offset: offset, limit: pageSize};
    }

    return this.api.getTaskGroupActivity(taskGroupId, params);
  }

  setUserPresence(userId: string, status: string) {
    this.usersList[userId].status = status;
  }

  reloadUsersList(): Observable<RocketChatUserInfo[]> {
    return this.getUsersList().pipe(tap((response: RocketChatUserInfo[]) => {
      response.forEach((user: RocketChatUserInfo) => {
        this.usersList[user.id] = user;
      });
    }));
  }

  starMessage(messageId: string): Observable<any> {
    return this.getChatCredentials().flatMap(user => {
      const body = {
        header: {
          'X-Auth-Token': user.token,
          'X-User-Id': user.user_id.toString(),
        },
        message_id: messageId,
      };

      return this.api.starMessage(body);
    });
  }

  unStarMessage(messageId: string): Observable<any> {
    return this.getChatCredentials().flatMap(user => {
      const body = {
        header: {
          'X-Auth-Token': user.token,
          'X-User-Id': user.user_id.toString(),
        },
        message_id: messageId,
      };

      return this.api.unStarMessage(body);
    });
  }

  markRoomAsRead(roomId: string): Observable<any> {
    return this.getChatCredentials().flatMap(user => {
      const body = {
        header: {
          'X-Auth-Token': user.token,
          'X-User-Id': user.user_id.toString(),
        },
        room_id: roomId,
      };

      return this.api.markRoomAsRead(body);
    });
  }

  protected getUsersList(): Observable<RocketChatUserInfo[]> {
    return this.getChatCredentials().flatMap(user => {
      const options = <RequestOptionsArgs>{
        params: {
          'X-Auth-Token': user.token,
          'X-User-Id': user.user_id.toString(),
        },
      };

      return this.api.getUsersList(options)
        .map(response => response.json());
    });
  }

  protected dataURLtoFile(dataURL, filename) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type: mime});
  }

  protected parseMessagesResponse(response): ChatMessageModel[] {
    const data = response.json();

    if (data.success === false) {
      throw new Error(data.error);
    }

    if (data && data.messages) {
      return data.messages
        .filter(message => message.u.username !== 'rocket')
        .map(this.mapMessageToChatMessage);
    }

    return [];
  }

  protected mapMessageToChatMessage(message): ChatMessageModel {
    return {
      id: message._id,
      text: this.getMessageText(message),
      time: moment(message.ts).toDate(),
      userId: message.u._id,
      name: message.u.name,
      username: message.u.username,
      user: null,
      message_type: message.message_type,
      attachments: message.attachments,
      is_reply: message.is_reply ? message.is_reply : false,
      // options: message.options && message.options.length > 0 ? message.options : []
      options: this.getMessageOptions(message),
      flag: message.flag ? message.flag : false,
      agree_count: message.agree_count ? message.agree_count : null,
      diagree_count: message.diagree_count ? message.diagree_count : null,
      message_by: message.message_by,
      editable: message.editable,
      editedBy: message.editedBy,
      starred: message.starred ? message.starred : [],
    } as ChatMessageModel;
  }

  protected getMessageText(message) {
    if (message.mentions && message.mentions.length > 0) {
      if (message.msg.indexOf(message.mentions[0].username) > -1) {
        return message.msg.split(message.mentions[0].username)[1];
      }
    } else if (message.urls && message.urls.length > 0 && message.msg.indexOf(message.urls[0].url) > -1) {
      return message.msg.split(message.urls[0].url + ')')[1];
    }

    return message.msg;
  }

  protected getMessageOptions(message) {
    if (message.voting_result && message.voting_result.length > 0) {
      return message.voting_result;
    } else if (message.options && message.options.length > 0) {
      return message.options;
    }

    return [];
  }

  // /**
  //  * Send message to a chat room.
  //  *
  //  * @param message - message body
  //  * @param roomId - Rocket.Chat room id
  //  * @param messageType
  //  * @param attachments
  //  * @param emoji
  //  * @param decisionPollSelectedList
  //  * @param parent_message_id
  //  */
  // sendMessage(message, roomId, messageType, attachments, emoji, decisionPollSelectedList, parent_message_id) {
  //   // return this.post('chat.postMessage', {roomId: roomId, text: message});
  //   return this.post('post-msg', {
  //     roomId: roomId,
  //     text: message,
  //     messageType: messageType,
  //     attachments: attachments,
  //     emoji: emoji,
  //     options: decisionPollSelectedList,
  //     parent_message_id: parent_message_id,
  //   });
  // }
}
