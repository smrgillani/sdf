import {Component, Input, ViewChild, ElementRef} from '@angular/core';
import {Router} from '@angular/router';

import {RoleService} from 'app/core/role.service';
import Roles from 'app/core/models/Roles.enum';
import {ForumOverviewComponent} from 'app/founder/forum/forum-overview/forum-overview.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [
    './navbar.component.scss'
  ]
})
export class NavBarComponent {
  @Input() isLoggedIn = true;
  @ViewChild('navbarMenu') navbarMenu: ElementRef;
  foc = new ForumOverviewComponent(null, null);
  menuItemShown: boolean;

  private navForFounder = false;

  constructor(
    private router: Router,
    private roleService: RoleService
  ) {
      this.menuItemShown = true;
   }

  ngOnInit() {
    // this.navbarMenu.nativeElement.style.display = 'none';
  }

  goHome() {
    const role = this.roleService.getCurrentRole();
    this.router.navigate([({
      [Roles.Creator]: '/founder',
      // [Roles.Backer]: '/backer',
      [Roles.Employee]: '/employee',
    })[role]]);
  }

  toggleMenuItems() {
    // this.menuItemShown = !this.menuItemShown;
    // this.foc.toggleButtons(this.menuItemShown);
  }

}
