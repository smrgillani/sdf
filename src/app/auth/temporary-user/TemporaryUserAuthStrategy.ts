import {Injectable} from '@angular/core';
import {tokenNotExpired} from 'angular2-jwt';

import {AuthStrategy} from '../interfaces';


/**
 * Temporary user auth strategy.
 * Almost same as TokenAuthStrategy, but handle more localStorage options
 */
@Injectable()
export class TemporaryUserAuthStrategy implements AuthStrategy {
  protected storageKey = 'temporary';

  login(options?: any) {
    localStorage.setItem('token', options['token']);
    localStorage.setItem(this.storageKey, 'true');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem(this.storageKey);
  }

  isLoggedIn(): boolean {
    return tokenNotExpired('token')
      && JSON.parse(localStorage.getItem(this.storageKey));
  }
}
