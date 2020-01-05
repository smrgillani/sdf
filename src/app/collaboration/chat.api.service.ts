import { Injectable } from '@angular/core';
import { ApiService } from '../core/api/api.service';
import { Headers, Http, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ChatCredentialsModel, ChatRoomModel } from './models';
import { environment } from '../../environments/environment';

@Injectable()
export class ChatApiService {
  constructor(
    private apiService: ApiService,
    private http: Http,
  ) {
  }

  getChatCredentials(): Observable<ChatCredentialsModel> {
    return this.apiService.get('chat/token');
  }

  getChatUser(userId: string): Observable<{ user }> {
    return this.apiService.get(`chat/user/profile/${userId}`);
  }

  getRoomMembers(roomId): Observable<any> {
    return this.apiService.get(`room-members`, {roomId: roomId});
  }

  getChatRoom(taskId): Observable<ChatRoomModel> {
    return this.apiService.get(`chat/task/${taskId}`);
  }

  getChatRoomByServiceId(serviceId): Observable<ChatRoomModel> {
    return this.apiService.get(`chat/service/${serviceId}`);
  }

  getPublicRoomId(projectId): Observable<ChatRoomModel> {
    return this.apiService.get(`chat/project/${projectId}`);
  }

  getLunchRoomInfo(lunchRoomId, projectId): Observable<ChatRoomModel> {
    return this.apiService.get(`lunch-room`, {project: projectId, id: lunchRoomId});
  }

  sendMessage(body): Observable<any> {
    return this.http.post(`${environment.server}/post-msg/`, JSON.stringify(body));
  }

  updateMessage(body): Observable<any> {
    return this.apiService.put(`chat-update`, body);
  }

  deleteMessage(body): Observable<any> {
    return this.apiService.put('chat-update', body);
  }

  getChatHistory(body): Observable<any> {
    return this.http.post(`${environment.server}/group-history/`, JSON.stringify(body));
  }

  getChatHistoryForService(body): Observable<any> {
    return this.http.post(`${environment.server}/service-group-history/`, JSON.stringify(body));
  }

  getProjectChatHistory(body): Observable<any> {
    return this.http.post(`${environment.server}/im-history/`, JSON.stringify(body));
  }

  postFormData(formData: FormData, headers: Headers): Observable<any> {
    return this.http.post(`${environment.server}/upload/`, formData, {headers});
  }

  postSelectedPollOption(data): Observable<any> {
    return this.apiService.post(`poll-voting`, data);
  }

  postUploadAttachment(body): Observable<any> {
    return this.http.post(`${environment.server}/upload/`, JSON.stringify(body));
  }

  postShowInterest(body): Observable<any> {
    return this.http.post(`${environment.server}/show-interest/`, JSON.stringify(body));
  }

  getAllChatRooms(options: RequestOptionsArgs): Observable<any> {
    return this.http.get(`${environment.server}/direct-room-list/`, options);
  }

  postDirectRoom(body): Observable<any> {
    return this.http.post(`${environment.server}/direct-room/`, body);
  }

  getTaskGroupActivity(taskGroupId: number, params?): Observable<any> {
    return this.apiService.get<any>(`task-group-log/${taskGroupId}`, params);
  }

  getUsersList(options: RequestOptionsArgs) {
    return this.http.get(`${environment.server}/users-list/`, options);
  }

  starMessage(body): Observable<any> {
    return this.http.post(`${environment.server}/star-message/`, JSON.stringify(body));
  }

  unStarMessage(body): Observable<any> {
    return this.http.post(`${environment.server}/un-star-message/`, JSON.stringify(body));
  }

  markRoomAsRead(body): Observable<any> {
    return this.http.post(`${environment.server}/subscriptions-read/`, JSON.stringify(body));
  }

  getDirectRoomsCounters(options: RequestOptionsArgs) {
    return this.http.get(environment.server + '/direct-rooms-counters/', options);
  }
}
