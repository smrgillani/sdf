import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from 'app/auth/auth.service';
import Roles from 'app/core/models/Roles.enum';
import { RoleService } from 'app/core/role.service';
import { AccountService } from 'app/founder/account/account.service';
import UserProfileModel from 'app/core/models/UserProfileModel';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: [
    './profile-menu.component.scss',
  ],
})
export class ProfileMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  notificationsCount:number = 0;
  messagesCount:number = 0;
  Roles = Roles;
  role: Roles;
  name: string;
  isTemporaryUser: boolean;
  message: string;
  photo: string;
  tempPassword = 'Intelegain@123';
  isEditMode = false;
  is_kyc_complete = false;
  private internalUserProfile: UserProfileModel;
  private profileUpdate: Subscription = new Subscription();
  private timerId: any;
  private editTempName: string;
  private editTempPassword: string;
  private subscriptions: Subscription[] = [];

  @ViewChild(NgbPopover) popover: NgbPopover;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private roleService: RoleService,
    private auth: AuthService,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.fetchNotificationCount();
    this.fetchMessagesCount();

    this.role = this.roleService.getCurrentRole();
    this.getUserName();

    console.log('link:', '/#' + this.roleService.getCurrentHome() + '/chat-rooms');  

    this.subscriptions.push(this.accountService.notificationCountSubject
      .subscribe(val => {
        this.notificationsCount = val;
        let lsnCount = localStorage.getItem('notificationsCount_');
        let nCount = lsnCount != null ? parseInt(lsnCount) : 0;
       
        // console.log('lsnCount:', lsnCount);  
        console.log('notificationsCount:', this.notificationsCount);  
        console.log('nCount:', nCount);  

        if (nCount > 0) {
            if (this.notificationsCount > nCount) {
              let notificationPopup = new Notification('New Notification', {
                icon: '/assets/favicon.ico?v=2',
                body: 'You have ' + this.notificationsCount + ' unread notifications(s).'
              });

              notificationPopup.onclick = function(e) {
                e.preventDefault();
                window.open('/#/notifications', '_blank');
              };

              localStorage.setItem('notificationsCount_', this.notificationsCount.toString());
            } else {
              console.log('No new notification!');
            }
        } else {
          if (this.notificationsCount > 0) {
            let notificationPopup = new Notification('New Notification', {
              icon: '/assets/favicon.ico?v=2',
              body: 'You have ' + this.notificationsCount + ' unread notifications(s).'
            });
   
            notificationPopup.onclick = function(e) {
              e.preventDefault();
              window.open('/#/notifications', '_blank');
            };
  
            localStorage.setItem('notificationsCount_', this.notificationsCount.toString());
          }
        }
      }));

    this.subscriptions.push(this.accountService.messagesCountersSubject
      .subscribe(val => {
        this.messagesCount = val.unreads;
        let lsmCount = localStorage.getItem('messagesCount_');
        let mCount = lsmCount != null ? parseInt(lsmCount) : 0;
        let self = this;

        // console.log('lsmCount:', lsmCount);  
        console.log('messagesCount:', this.messagesCount);  
        console.log('mCount:', mCount);  

        if (mCount > 0) {
            if (this.messagesCount > mCount) {
              localStorage.setItem('messagesCount_', this.messagesCount.toString());

              let notificationPopup = new Notification('New Message', {
                icon: '/assets/favicon.ico?v=2',
                body: 'You have ' + this.messagesCount + ' unread message(s).'
              });
              
              notificationPopup.onclick = function(e) {
                e.preventDefault();
                window.open('/#' + self.roleService.getCurrentHome() + '/chat-rooms', '_blank');
              };
            } else {
              if (this.messagesCount < mCount) {
                localStorage.setItem('messagesCount_', this.messagesCount.toString());
              }

              console.log('No new message notification!');
            }
        } else {
          if (this.messagesCount > 0) {
            localStorage.setItem('messagesCount_', this.messagesCount.toString());

            let notificationPopup = new Notification('New Message', {
              icon: '/assets/favicon.ico?v=2',
              body: 'You have ' + this.messagesCount + ' unread message(s).'
            });

            notificationPopup.onclick = function(e) {
              e.preventDefault();
              window.open('/#' + self.roleService.getCurrentHome() + '/chat-rooms', '_blank');
            };
          }
        }
      }));

    this.timerId = setInterval(() => {
      this.fetchNotificationCount();
      this.fetchMessagesCount();
    }, 60000);

    this.isTemporaryUser = this.auth.isTemporaryUser();

    this.profileUpdate = this.accountService.profileUpdated.subscribe((user: UserProfileModel) => {
      this.internalUserProfile = user;
      this.name = user.first_name || user.email || user.user_name;
      this.photo = user.photo_crop;
      this.tempPassword = user.temp_password;
      this.is_kyc_complete = user.is_kyc_complete;
      this.role = user.role;
    });
  }

  ngAfterViewInit() {
    if (this.auth.isTemporaryUser()) {
      this.message = 'Please, update your personal info to save your current progress.';
      this.popover.container = 'body';
      this.popover.placement = 'bottom';
      this.popover.open();
      this.cd.detectChanges();
    } else {
      this.isTemporaryUser = false;
    }
  }

  ngOnDestroy() {
    clearInterval(this.timerId);

    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  openProfile() {
    this.router.navigate(['/founder/account']);
  }

  editProfile() {
    this.popover.close();
    this.router.navigate(['/founder/account/edit']);
  }

  setRole(role: Roles) {
    this.roleService.setCurrentRole(role);
    this.internalUserProfile.role = role;

    this.role = role;
    this.accountService.updateProfile(this.internalUserProfile)
      .subscribe(
        () => {
          this.router.navigate([this.roleService.getCurrentHome()]);
        });
  }

  signOut() {
    localStorage.removeItem('currentRole');
    localStorage.removeItem('userCountry');
    localStorage.removeItem('userCountryName');
    localStorage.removeItem('keepMeLoggedIn');
    this.accountService.clearProfileCache();
    this.router.navigateByUrl('/login');

    this.accountService.signOut().subscribe(() => {
      this.auth.logout();
    });
  }

  onPopoverShown() {
    setTimeout(() => {
      this.popover.close();
    }, 5000);
  }

  goNotifications() {
    this.notificationsCount = 0;
    this.router.navigate(['/notifications']);
  }

  goChatRoom(roleType) {
    let path;

    switch (roleType) {
      case 'creator':
        path = '/founder/chat-rooms';
        break;
      case 'backer':
        path = '/backer/chat-rooms';
        break;
      default:
        path = '/employee/chat-rooms';
    }

    this.router.navigate([path]);
  }

  goToWallet() {
    this.router.navigate(['/founder/wallet']);
  }

  convertToPermanent() {
    const userData: { user_name: string, password: string } = {
      user_name: this.name,
      password: this.tempPassword,
    };

    this.accountService.updateTempProfile(userData)
      .subscribe(
        (data) => {
          this.isEditMode = false;
          this.auth.setPermanentStrategy();
          this.accountService.cachedProfile.user_name = data.user_name;
          this.isTemporaryUser = false;
          this.router.navigate([this.roleService.getCurrentHome()]);
        },
        (error) => {
          console.log(error);
          this.message = error.user_name || error.password;
          this.popover.container = 'body';
          this.popover.placement = 'bottom';
          this.popover.open();
        });
  }

  editTempUser() {
    this.editTempName = _.cloneDeep(this.name);
    this.editTempPassword = _.cloneDeep(this.tempPassword);
    this.isEditMode = true;
  }

  unEditTempUser() {
    this.name = _.cloneDeep(this.editTempName);
    this.tempPassword = _.cloneDeep(this.editTempPassword);
    this.isEditMode = false;
  }

  private getUserName() {
    this.accountService.getProfile()
      .subscribe((user) => {
        this.internalUserProfile = user;
        this.name = user.first_name || user.email || user.user_name;
        this.photo = user.photo_crop;
        this.tempPassword = user.temp_password;
        this.is_kyc_complete = user.is_kyc_complete;
      });
  }

  private fetchNotificationCount() {
    this.accountService.fetchNotificationCount().subscribe();
  }

  private fetchMessagesCount() {
    this.accountService.fetchMessagesCount().subscribe();
  }
}
