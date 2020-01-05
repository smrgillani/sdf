import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';

import {AuthService} from 'app/auth/auth.service';

import Role from 'app/core/models/Role';
import Roles from 'app/core/models/Roles.enum';
import {RoleService} from 'app/core/role.service';
import {AccountService} from 'app/founder/account/account.service';


@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: [
    './profile-menu.component.scss'
  ]
})
export class ProfileMenuComponent implements AfterViewInit {
  @ViewChild(NgbPopover) popover: NgbPopover;

  Roles = Roles;
  role: Roles;
  name: string;
  isTemporaryUser: boolean;
  message: string;
  photo: string;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private roleService: RoleService,
    private auth: AuthService
  ) {
    this.role = roleService.getCurrentRole();

    this.getUserName();
    this.isTemporaryUser = this.auth.isTemporaryUser();
  }

  getUserName() {
    this.accountService.getProfile()
      .subscribe((user) => {
        this.name = user.first_name || user.email;
        this.photo = user.photo_crop;
      });
  }

  openProfile() {
    this.router.navigate(['/founder/account']);
  }

  editProfile() {
    this.router.navigate(['/founder/account/edit']);
  }

  setRole(role: Roles) {
    this.roleService.setCurrentRole(role);
    this.role = role;
    this.router.navigate([this.roleService.getCurrentHome()]);
  }

  signOut() {
    localStorage.removeItem('currentRole');
    localStorage.removeItem('userCountry');
    localStorage.removeItem('userCountryName');
    localStorage.removeItem('keepMeLoggedIn');
    this.accountService.clearProfileCache();
    this.router.navigateByUrl('/login');
    
    this.auth.logoutEvent.subscribe(() => this.clear());
  }

  clear() {
    localStorage.removeItem('localData');
    localStorage.removeItem('localDataSource');
    localStorage.removeItem('localDataResource');
    localStorage.removeItem('project_id');
    localStorage.removeItem('milestone_id');
    localStorage.removeItem('edit_item');
    localStorage.removeItem('taskcountByStatus');
    localStorage.removeItem('project_name');
    localStorage.removeItem('tasks_itemid_originid');
    localStorage.setItem('signout', 'true');
  }


  ngAfterViewInit() {
    if (this.auth.isTemporaryUser()) {
      this.message = 'Please, update your personal info to save your current progress.';
      this.popover.container = 'body';
      this.popover.placement = 'bottom';
      this.popover.open();
    }
  }
}
