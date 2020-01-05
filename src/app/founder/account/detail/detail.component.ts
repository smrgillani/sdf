import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

import {AccountService} from '../account.service';
import UserProfileModel from 'app/core/models/UserProfileModel';
import {UserProfile} from 'app/core/interfaces';
import { LoaderService } from 'app/loader.service';
import { environment } from 'environments/environment';

@Component({
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class ViewAccountComponent implements OnInit {
  private profile: UserProfile;
  popoverTimerList = {};
  serverUrlToAppend:string = '';

  constructor(
    private accountService: AccountService,
    private loaderService: LoaderService,
    private router: Router
  ) {
    this.profile = new UserProfileModel();
    this.serverUrlToAppend = environment.server.replace('/api/v1','');
  }

  ngOnInit() {
     this.loadProfile();
  }

  loadProfile() {
    this.accountService.getProfile()
      .subscribe(
        (userProfile) => {
          this.profile = userProfile;
          if(userProfile.photo && userProfile.photo.indexOf('https')<0){
            userProfile.photo = `${this.serverUrlToAppend}${userProfile.photo}`;
          }
          if(userProfile.passport_photo && userProfile.passport_photo.indexOf('https')<0){
            userProfile.passport_photo = `${this.serverUrlToAppend}${userProfile.passport_photo}`;
          }
          if(userProfile.driver_license_photo && userProfile.driver_license_photo.indexOf('https')<0){
            userProfile.driver_license_photo = `${this.serverUrlToAppend}${userProfile.driver_license_photo}`;
          }
          console.log('user profile', this.profile);
        },
        (errorMsg: any) => {
          console.log(errorMsg);
        }
      );
  }

  walletshow(){
    this.router.navigate(['/founder/wallet']);
  }

  showBalanceSheet() {
    this.router.navigate(['/founder/balance-sheet']);
  }
}
