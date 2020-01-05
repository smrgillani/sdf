import {NgModule} from '@angular/core';
import {Http, RequestOptions} from '@angular/http';
import {AuthHttp, AuthConfig} from 'angular2-jwt';

import {RoleService} from 'app/core/role.service';
import {AccountService} from 'app/founder/account/account.service';
import {LoginService} from 'app/auth/login.service';
import {TokenAuthStrategy} from './TokenAuthStrategy';
import {TemporaryUserAuthStrategy} from './temporary-user/TemporaryUserAuthStrategy';
import { ChatService } from 'app/collaboration/chat.service';
import { UserCountryService } from 'app/core/user-country.service';
import { ChatApiService } from '../collaboration/chat.api.service';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    headerPrefix: 'JWT'
  }), http, options);
}

@NgModule({
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    AccountService,
    ChatApiService,
    ChatService,
    LoginService,
    RoleService,
    UserCountryService,
    TokenAuthStrategy,
    TemporaryUserAuthStrategy
  ]
})
export class AuthModule {}
