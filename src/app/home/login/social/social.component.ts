import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from 'environments/environment';

import { AuthService } from '../ng4-social-login';
import { SocialUser } from '../ng4-social-login';
import { GoogleLoginProvider, FacebookLoginProvider, LinkedinLoginProvider } from '../ng4-social-login';

import {AuthService as LocalAuthService} from 'app/auth/auth.service';
import {LoginService, TokenResponse} from 'app/auth/login.service';
import UserProfileModel from 'app/core/models/UserProfileModel';
import {RoleService} from 'app/core/role.service';
import Roles from 'app/core/models/Roles.enum';
import {LoginRequest} from 'app/auth/models/LoginRequest';
import { UserCountryService } from 'app/core/user-country.service';
// import * as myExtObject from 'app/home/login/social/paypal.js';

// declare var paypal:any;
// declare var myExtObject:any;

@Component({
  selector: 'app-login-social',
  templateUrl: './social.component.html',
  styleUrls: [
    './social.component.scss',
    './social.component.portrait.css'
  ],
  providers:[AuthService]
})

export class SocialComponent implements OnInit {
  user: SocialUser;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loginService: LoginService,
    private roleService: RoleService,
    private localAuthService: LocalAuthService,
    private userCountryService: UserCountryService,
  ) { }

  ngOnInit(){ }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((obj)=>{
      this.authenticateUser(obj);
    });
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((obj)=>{
      this.authenticateUser(obj);
    });
  }

  signInWithTwitter(): void {
    window.location.href = environment.server + '/twitter/login';
  }

  signInWithLinkedIn(): void {
    //this.authService.signIn(LinkedinLoginProvider.PROVIDER_ID);
    this.authService.signIn(LinkedinLoginProvider.PROVIDER_ID).then((obj)=>{
      this.authenticateUser(obj);
    });
  }

  signInWithPaypal():void{
    let client_id:string = environment.paypalClientKey;
    let redirect_uri = `${environment.server}${environment.paypalRedirectUri}`;
    window.location.href = `${environment.paypalSignInUri}?client_id=${client_id}&response_type=code&scope=${environment.paypalScope}&redirect_uri=${redirect_uri}`;
  }


  signOut(): void {
    this.authService.signOut();
  }

  navigateToNext(user: UserProfileModel) {
    this.userCountryService.getUserCountry()
    .subscribe((data) => {
        if (!data) {
          this.router.navigate(['/country']);
        }
        else {
          this.roleService.getPrimaryRole()
          .subscribe((role: Roles) => {
            if (role) {
              this.roleService.setCurrentRole(role);
              this.router.navigate([this.roleService.getCurrentHome()]);
            } else {
              this.router.navigate(['/role']);
            }
          });
        }
      }, (error) => {
        console.log('Error while fetching the user country', error);
        this.userCountryService.setUserCountryIntoLocal(null,null);
        return false;
      });
  }

  authenticateUser(user: SocialUser){
    //this.authService.authState.subscribe((user) => {
      if(user && user.id){
        this.user = user;
        this.loginService.socialmediaLogin(user)
        .subscribe((response: LoginRequest)=>{
          this.loginService.socialLogin(response)
          .subscribe(
            (response: TokenResponse) => {
              this.localAuthService.login(response.token);
              // TODO: get user info
              const user = {} as UserProfileModel;
              this.navigateToNext(user);
            }
          );
        }
      )
    }
    //});
  }
}
