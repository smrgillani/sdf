import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {AuthService} from 'app/auth/auth.service';


@Component({
  template: `Logging out...`
})
export class LogoutComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    localStorage.clear();
    this.authService.logout();
  }
}
