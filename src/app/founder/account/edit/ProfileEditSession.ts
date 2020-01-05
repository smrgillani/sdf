import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import UserProfileModel from 'app/core/models/UserProfileModel';
import {AccountService} from '../account.service';

/**
 * Class for storing user data between screens of editing user profile data and user profile photo.
 */
@Injectable()
export class ProfileEditSession {
  private user: UserProfileModel;
  protected hasNestedEdits = false;

  constructor(
    private accountService: AccountService
  ) {}


  /**
   * Returns user objects depends on is session is nested.
   *
   * @param isNestedSession - flag, indicate nested session
   * @return - User data depending on session is nested
   */
  getUser(isNestedSession = false): Observable<UserProfileModel> {
    if (this.hasNestedEdits || isNestedSession) {
      if (!isNestedSession) {
        this.hasNestedEdits = false;
      }
      return Observable.of(this.user);
    }

    return this.accountService.getProfile()
      .map((user: UserProfileModel) => {
        this.user = user;
        return user;
      });
  }

  saveNestedSession() {
    this.hasNestedEdits = true;
  }
}
