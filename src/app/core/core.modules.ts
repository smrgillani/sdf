import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {LocalStorage} from './local-storage.service';
import {throwIfAlreadyLoaded} from './module-import-guard';
import {AuthService} from '../auth/auth.service';
import {ApiService} from './api/api.service';
import {IsAuthenticated} from '../auth/permissions';
import {RoleService} from './role.service';
import { UserCountryService } from './user-country.service';


@NgModule({
  imports: [CommonModule, HttpModule],
  providers: [
    ApiService,
    AuthService,
    IsAuthenticated,
    LocalStorage,
    RoleService,
    UserCountryService
  ]
})

export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
