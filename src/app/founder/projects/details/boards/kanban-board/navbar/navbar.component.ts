import {Component, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {RoleService} from 'app/core/role.service';
import Roles from 'app/core/models/Roles.enum';
import {environment} from 'environments/environment';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [
    './navbar.component.scss'
  ]
})
export class NavBarComponent {
  @Input() isLoggedIn = true;

  private navForFounder = false;
  private project_id: number;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private roleService: RoleService
  ) {
    this.route.params.subscribe((params) => {
      this.project_id = params['id'];
    });
  }

  goHome() {
    const role = this.roleService.getCurrentRole();
    this.router.navigate([({
      [Roles.Creator]: '/founder',
      // [Roles.Backer]: '/backer',
    })[role]]);
  }
  backToProject() {
    this.router.navigate(['/founder/projects/' + this.project_id]);
  }
}
