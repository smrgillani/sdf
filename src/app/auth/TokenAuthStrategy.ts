import {Injectable} from '@angular/core';
import {tokenNotExpired} from 'angular2-jwt';

import {AuthStrategy} from './interfaces';


/**
 * Token authentication strategy
 */
@Injectable()
export class TokenAuthStrategy implements AuthStrategy {
  /**
   * Login with token
   *
   * @param options
   */
  login(options?: any) {
    localStorage.setItem('token', options['token']);
  }

  /**
   * Logout (remote token from storage)
   */
  logout() {
    localStorage.removeItem('token');
  }
 
  /**
   * Indicates user has token
   *
   * @returns {boolean}
   */
  isLoggedIn(): boolean {
    return tokenNotExpired('token');
  }
}
