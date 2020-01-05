import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiService } from 'app/core/api/api.service';
import { HasId } from 'app/core/interfaces';
import { CategoryInfo, ThreadInfo } from 'app/projects/models/forum-info-model';
import ProjectPaginationModel from 'app/projects/models/ProjectPaginationModel';
import { EventInfoModel } from './models/event-info-model';

export class Visibility implements HasId {
  id: number;
  is_visible: boolean;
}

@Injectable()
export class ForumService {

  constructor(private api: ApiService) {
  }

  getCategoryList(): Observable<CategoryInfo[]> {
    return this.api.get<CategoryInfo[]>('forum-category');
  }

  getThreadInfoList(categoryId?: number, topicId?: number, startPage?, pageSize?, searchText?, isMostView?): Observable<any[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      const title = searchText;
      if (categoryId && !isMostView && !topicId) {
        return this.api.get<any[]>(`forum-category/${categoryId}/thread_list`, {
          offset: offset,
          limit: pageSize,
          title: title,
          search: searchText,
        });
      } else if (categoryId && isMostView && !topicId) {
        return this.api.get<any[]>(`forum-category/${categoryId}/thread_mostviewlist`, {
          offset: offset,
          limit: pageSize,
          title: title,
          search: searchText,
        });
      } else if (!categoryId && isMostView && !topicId) {
        return this.api.get<any[]>(`forum-mostview`, {offset: offset, limit: pageSize, title: title, search: searchText});
      } else if (categoryId && !isMostView && topicId) {
        return this.api.get<any[]>(`forum-category/${categoryId}/topics/${topicId}/thread-list`, {
          offset: offset,
          limit: pageSize,
          title: title,
          search: searchText,
        });
      } else if (categoryId && isMostView && topicId) {
        return this.api.get<any[]>(`forum-category/${categoryId}/topics/${topicId}/thread-mostviewlist`, {
          offset: offset,
          limit: pageSize,
          title: title,
          search: searchText,
        });
      }
      return this.api.get<any[]>(`forum`, {offset: offset, limit: pageSize, title: title, search: searchText});
    }
    return this.api.get<any[]>(`forum`);
  }

  getEventList(startPage?, pageSize?, searchText?): Observable<any[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any[]>(`forum-events`, {offset: offset, limit: pageSize, search: searchText});
    }
    return this.api.get<any[]>(`forum-events`);
  }

  getInviteFriendList(startPage?, pageSize?, searchText?, eventId?): Observable<any[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any[]>(`forum-events/${eventId}/user-list`, {offset: offset, limit: pageSize, search: searchText});
    }
    return this.api.get<any[]>(`forum-events/${eventId}/user-list`);
  }

  getEventInfo(eventId?): Observable<any> {
    return this.api.get<any>(`forum-event-invitation/${eventId}`);
  }

  updateEventInfoStatus(eventId?, status?): Observable<any> {
    return this.api.put(`forum-event-invitation/${eventId}`, {status: status});
  }

  postInviteFriends(data, eventId): Observable<any> {
    return this.api.post(`forum-events/${eventId}/send-invitation`, data);
  }

  getTopicInfoList(): Observable<any[]> {
    return this.api.get<any[]>(`forum-topics`);
  }

  getCategoryTopicInfoList(categoryId?: number, startPage?, pageSize?): Observable<any[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any[]>(`forum-category/${categoryId}/topics`, {offset: offset, limit: pageSize});
    }
    return this.api.get<any>(`forum-category/${categoryId}/topics`);
  }

  getTopicsTreadInfoList(topicId?: number, startPage?, pageSize?, searchText?): Observable<any> {
    if (pageSize) {
      return this.api.get<any>(`forum-topics/${topicId}/thread_list`, {
        offset: (startPage - 1) * pageSize,
        limit: pageSize,
        title: searchText,
        search: searchText
      });
    }
    return this.api.get<any>(`forum-topics/${topicId}/thread_list`);
  }

  getForumUserInfoList(): Observable<any> {
    return this.api.get<any>(`forum_user_list`);
  }

  getCreatorUserInfoList(): Observable<any> {
    return this.api.get<any>(`accounts/profile/creators`);
  }

  postNewThread(data: ThreadInfo): Observable<any> {
    return this.api.post(`forum`, data);
  }

  postNewEvent(data: EventInfoModel): Observable<any> {
    return this.api.post(`forum-events`, data);
  }

  getForumUserThreadList(id: number): Observable<any> {
    return this.api.get<any>(`forum_user_thread`, {user_id: id});
  }

  getUserThreadInfoList(id: number, startPage?, pageSize?): Observable<any> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any>(`people-threads`, {user_id: id, offset: offset, limit: pageSize});
    }
    return this.api.get<any>(`people-threads`, {user_id: id});
  }

  savePostsAgainstThread(data): Observable<any> {
    return this.api.post(`forum-comments`, data);
  }

  setThreadViewCount(id): Observable<any> {
    return this.api.get(`forum-comments`, {thread_id: id});
  }

  getTreadInfoByIdList(threadId?: number, startPage?, pageSize?, searchText?): Observable<any> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any>(`forum/${threadId}/comment_list`, {
        offset: offset,
        limit: pageSize,
        title: searchText,
        search: searchText,
      });
    }
    return this.api.get<any>(`forum/${threadId}/comment_list`);
  }

  getForumVideosList(startPage?, pageSize?, searchText?): Observable<ProjectPaginationModel> {
    if (!pageSize) {
      pageSize = 10;
    }
    if (!startPage) {
      startPage = 1;
    }
    const offset = (startPage - 1) * pageSize;
    return this.api.get<ProjectPaginationModel>(`forum-videos`, {
      offset: offset,
      limit: pageSize,
      title: searchText,
      search: searchText,
    });
  }

  saveForumVideo(data: { title: string, url: string }): Observable<any> {
    return this.api.post(`forum-videos`, data);
  }

  getThreadInfo(id: number): Observable<any> {
    return this.api.get<any>(`thread-update/${id}`);
  }

  putThreadInfo(info: ThreadInfo): Observable<any> {
    if (info.image && info.image.indexOf('data:') < 0) {
      delete info.image;
    }
    return this.api.put(`thread-update/${info.id}`, info);
  }

  postAttendEvent(data, eventId): Observable<any> {
    return this.api.post(`forum-events/${eventId}/attend-event`, data);
  }

  getAttendUserList(startPage?, pageSize?, searchText?, eventId?, listFor?): Observable<any[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any[]>(`forum-events/${eventId}/user-list/${listFor}`, {offset: offset, limit: pageSize, search: searchText});
    }
    return this.api.get<any[]>(`forum-events/${eventId}/user-list/${listFor}`);
  }

}
