import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as _ from 'lodash';
import * as moment from 'moment';

import UserProfileModel from 'app/core/models/UserProfileModel';
import { ApiService } from 'app/core/api/api.service';
import { ChangePasswordModel } from 'app/core/models/ChangePasswordModel';
import { Headers, Http, Response, RequestOptionsArgs } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

import { environment } from 'environments/environment';
import { NotificationModel } from 'app/projects/models/notification-model';
import { SetPasswordModel } from 'app/core/models/set-password-model';
import { ChatService } from 'app/collaboration/chat.service';

interface MessagesCounters {
  unreads: number;
  rooms_details: _.Dictionary<number>;
}

/**
 * User profile Service
 * Service provides functions for operations with user profile data
 */
@Injectable()
export class AccountService {
  cachedProfile: UserProfileModel;
  profileUpdated: Subject<UserProfileModel> = new Subject();

  cachedNotificationCount: number;
  notificationCountSubject = new Subject<number>();

  cachedMessagesCounters: MessagesCounters;
  messagesCountersSubject = new BehaviorSubject<MessagesCounters>({unreads: 0, rooms_details: {}});

  constructor(
    private api: ApiService,
    private http: Http,
    private authHttp: AuthHttp,
    private chatService: ChatService,
  ) {
  }

  /**
   * Get user profile data
   *
   * @returns user profile data
   */
  getProfile(): Observable<UserProfileModel> {
    if (this.cachedProfile) {
      return Observable.of(_.cloneDeep(this.cachedProfile));
    }

    return this.api.get<UserProfileModel>('accounts/profile')
      .map((userProfile: UserProfileModel) => {
        this.cachedProfile = userProfile;
        return _.cloneDeep(userProfile);
      });
  }

  setProfile(body): Observable<UserProfileModel> {
    const options = <RequestOptionsArgs>{};
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/json');

    return this.authHttp.put(environment.server + '/accounts/profile/', body, options)
      .map((response: Response) => {
        const profile: UserProfileModel = response.json();
        this.cachedProfile = profile;

        return profile;
      });
  }

  /**
   * Get employees data
   *
   * @returns employees data
   */
  getEmployees() {
    return this.api.get('accounts/profile/employees');
  }

  getParticipant(processId) {
    return this.api.get(`idea/get-dependent/${processId}/participants`);
  }

  getProcessCompletedParticipants(processId) {
    return this.api.get(`idea/get-dependent/${processId}/process-completed-participants`);
  }

  /**
   * Update user profile data
   *
   * @returns updated user profile data
   */
  updateProfile(userData: any) {
    userData.email = userData.email || undefined;
    const data = Object.assign({}, userData);
    if (data.photo && data.photo.indexOf('data:') < 0) {
      delete data.photo;
    }
    if (data.passport_photo && data.passport_photo.indexOf('data:') < 0) {
      delete data.passport_photo;
    }
    if (data.driver_license_photo && data.driver_license_photo.indexOf('data:') < 0) {
      delete data.driver_license_photo;
    }
    if (data.driver_license_back_photo && data.driver_license_back_photo.indexOf('data:') < 0) {
      delete data.driver_license_back_photo;
    }

    if (data.registration_country) {
      data.registration_country = data.registration_country.id;
    }

    data.date_of_birth = data.date_of_birth ? moment(data.date_of_birth).format('YYYY-MM-DD') : null;

    return this.api.put('accounts/profile', data)
      .map((userProfile: UserProfileModel) => {
        this.cachedProfile = userProfile;
        this.profileUpdated.next(this.cachedProfile);
        return userProfile;
      });
  }

  /**
   * Update user profile data
   *
   * @returns updated user profile data
   */
  updateTempProfile(userData: { user_name: string, password: string }) {
    return this.api.put('temp-user/profile', userData)
      .map((userProfile: any) => {
        return userProfile;
      });
  }

  checkPhoneIsValid(phone?: string): Observable<any> {
    if (phone) {
      return this.api.get<any>('phone_verify', {phone_number: phone});
    }

    return Observable.of({valid: true});
  }

  clearProfileCache() {
    this.cachedProfile = null;
    this.cachedNotificationCount = 0;
  }

  /**
   * User projile address autocomplete
   *
   * @param term - term for autocomplete
   * @returns list of addresses
   */
  getAddress(term: string) {
    if (term === '') {
      return Observable.of([]);
    }

    return this.api.get(`places/autocomplite`, {q: term})
      .map((response) => response);
  }

  signOut(): Observable<any> {
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};

    return this.authHttp.get(environment.server + '/api-auth/logout/', options)
      .map((r: Response) => {
        return 'signout done';
      }).catch(this.handleObservableError);
  }

  /**
   * Obtain string as a response using credentials (objChangePassword)
   *
   * @param objChangePassword - must be all fields to change password
   * @returns {Observable<R|T>}
   */
  changePassword(objChangePassword: ChangePasswordModel): Observable<string> {
    const body = JSON.stringify(objChangePassword);
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    options.headers = headers;

    return this.http.post(environment.server + '/password_change/', body, options)
      .map((r: Response) => r.json() as string)
      .catch(this.handleObservableError);
  }

  handleObservableError(error: any) {
    return Observable.throw(error.json().error || error.json());
  }

  fetchMessagesCount(): Observable<void> {
    return this.chatService.getDirectMessagesCount().map(data => {
      this.cachedMessagesCounters = data;
      this.messagesCountersSubject.next(this.cachedMessagesCounters);
    });
  }

  fetchNotificationCount(): Observable<void> {
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};

    return this.authHttp.get(environment.server + '/user/count/', options)
      .map((r: Response) => {
        const data = r.json();

        this.cachedNotificationCount = data.notification_count;
        this.notificationCountSubject.next(this.cachedNotificationCount);
      }).catch(this.handleObservableError);
  }

  getNotificationList(): Observable<NotificationModel[]> {
    return this.api.get<NotificationModel[]>('user/notification');
  }

  markAsReadNotification(notification: NotificationModel): Observable<NotificationModel[]> {
    return this.api.put(`user/notification/${notification.id}`, notification)
      .map((listInfo: NotificationModel[]) => {
        return listInfo;
      });
  }

  markAsSeenAllNotifications(): Observable<any> {
    return this.api.put('user/notification-seen', {});
  }

  deleteNotification(id: number): Observable<any> {
    return this.api.delete(`user/notification/${id}`);
  }

  /**
   * Obtain string as a response using credentials (objSetPassword)
   *
   * @param objSetPassword - must be all fields to change password
   * @returns {Observable<R|T>}
   */
  setPassword(objSetPassword: SetPasswordModel): Observable<any> {
    return this.api.put(`set-password/${objSetPassword.id}`, objSetPassword)
      .map((listInfo: any) => {
        return listInfo;
      });
  }

  getIsTempUser(): Observable<any> {
    return this.api.get<any>('temp-user/profile');
  }
}
