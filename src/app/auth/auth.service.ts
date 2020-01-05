import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';

import {AuthStrategy} from './interfaces';
import {TokenAuthStrategy} from './TokenAuthStrategy';
import {TemporaryUserAuthStrategy} from './temporary-user/TemporaryUserAuthStrategy';
import {AccountService} from 'app/founder/account/account.service';
import { ChatService } from 'app/collaboration/chat.service';


/**
 * Authentication service
 * Service provides functions for storage user authentication state
 */
@Injectable()
export class AuthService {
  loginEvent: Subject<any>;
  logoutEvent: Subject<any>;
  private strategy: AuthStrategy;

  constructor(
    private tokenAuthStrategy: TokenAuthStrategy,
    private temporaryUserAuthStrategy: TemporaryUserAuthStrategy,
    private router: Router,
    private accountService: AccountService,
    private chatService: ChatService
  ) {
    this.loginEvent = new Subject();
    this.logoutEvent = new Subject();
  }

  /**
   * Remember user with token
   *
   * @param token
   */
  login(token: any) {
    this.strategy = this.tokenAuthStrategy;
    this.strategy.login({token: token});
    this.loginEvent.next();
    this.accountService.clearProfileCache();
    this.chatService.clearProfileCache();
  }

  /**
   * Remember temporary user with token
   *localStorage
   * @param token
   */
  loginTemporary(token: string) {
    this.strategy = this.temporaryUserAuthStrategy;
    this.strategy.login({token: token});
    this.loginEvent.next();
    this.accountService.clearProfileCache();
    this.chatService.clearProfileCache();
  }

  /**
   * Logout user and triggers logoutEvent
   */
  logout() {
    if (this.strategy) {
      this.strategy.logout();
    }
    localStorage.clear();
    this.logoutEvent.next();
    // localStorage.removeItem('fcm_token');
    // localStorage.removeItem('currentRole');
    // localStorage.removeItem('userCountry');
    // localStorage.removeItem('userCountryName');
    // localStorage.removeItem('keepMeLoggedIn');
    this.accountService.clearProfileCache();
    this.chatService.clearProfileCache();
    this.router.navigateByUrl('/login');
  }

  /**
   * Check user is authenticated
   *
   * @returns {boolean}
   */
  loggedIn(): boolean {
    if (this.strategy) {
      return this.strategy.isLoggedIn();
    }

    for (const strategy of [
      this.temporaryUserAuthStrategy,
      this.tokenAuthStrategy,
    ]) {
      if (strategy.isLoggedIn()) {
        this.strategy = strategy;
        return true;
      }
    }

    return false;
  }

  /**
   * Check user is temporary
   *
   * @returns {boolean}
   */
  isTemporaryUser(): boolean {
    return this.strategy === this.temporaryUserAuthStrategy;
  }

  setPermanentStrategy(){
    this.strategy = this.tokenAuthStrategy;
  }
}
