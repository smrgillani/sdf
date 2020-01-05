import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import Role from './models/Role';
import Roles from './models/Roles.enum';
import { environment } from '../../environments/environment';
import { AccountService } from '../founder/account/account.service';
import UserProfileModel from './models/UserProfileModel';


/**
 * User Role Service
 * Service provides functions for operations with user roles
 */
@Injectable()
export class RoleService {
  private cachedRoles: Role[];

  constructor(
    private authHttp: AuthHttp,
    private accountService: AccountService,
  ) {
  }

  /**
   * Set user role on server
   *
   * @param role - role to set on server
   * */
  setPrimaryRole(role: Roles): Observable<any> {
    const body = JSON.stringify({role: role});

    return this.accountService.setProfile(body)
      .map((profile: UserProfileModel) => profile.role)
      .catch((error: any) => Observable.throw(error || 'set role error'));
  }

  /**
   * Set user role in localstorage
   *
   * @param role - role to set in localstorage
   * */
  setCurrentRole(role: Roles) {
    localStorage.setItem('currentRole', role);
  }

  /**
   *  @deprecated unnecessary after API changed
   * */
  getAvailableRoles(): Observable<Role[]> {
    if (this.cachedRoles) {
      return Observable.of((this.cachedRoles));
    }

    return this.authHttp.get(environment.server + '/accounts/roles/')
      .map((response: Response) => {
        this.cachedRoles = response.json();
        return this.cachedRoles;
      })
      .catch((error: any) => {
        return Observable.throw(error || 'get roles error');
      });
  }

  /**
   * Get user role from server
   *
   * @returns user role
   * */
  getPrimaryRole(): Observable<Roles> {
    return this.accountService.getProfile().map((profile: UserProfileModel) => profile.role);
  }

  /**
   * Get user role from localstorage
   *
   * @returns user role
   * */
  getCurrentRole(): Roles {
    const currentRole = localStorage.getItem('currentRole');
    return currentRole ? currentRole as Roles : null;
  }

  /**
   * Returns router link for current role homepage
   * */
  getCurrentHome(): string {
    return ({
      // [Roles.Backer]: '/backer',
      [Roles.Creator]: '/founder',
      [Roles.Employee]: '/employee',
    })[this.getCurrentRole()];
  }
}
