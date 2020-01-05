import { Component, Input, OnInit, HostBinding, EventEmitter, Output, HostListener } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { Location } from '@angular/common';
import { RoleService } from 'app/core/role.service';
import Roles from 'app/core/models/Roles.enum';

/**
 * Application's header bar.
 *
 * @input isLoggedIn - should be false if the page intended for not authenticated users
 * @input backNavOptions - options for back navigation link, it contains 'caption', 'route' and 'url' params
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public href: string = '';
  public previousUrl: string = '';
  @Input() showBackButton = true;
  @Input() isLoggedIn = true;
  @Input() position: string;
  // @HostBinding('class') classes = 'position-absolute';
  @Input() backNavOptions: {
    caption: string,
    route?: any[],
    url?: string
  };

  @Output() onBackClicked: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router,
    private roleService: RoleService,
    private location: Location,
  ) {
      this.href = this.router.url;
      this.router.events
      .filter(e => e instanceof RoutesRecognized)
      .pairwise()
      .subscribe((event: any[]) => {
        this.previousUrl = event[0].urlAfterRedirects;
      });

      console.log('href:', this.href);
  }

  ngOnInit(): void {}

  goHome() {
    if (this.href == '/country') {
      localStorage.clear();
      this.router.navigate(['/']);
    } else {
      if (!this.roleService) {
        const role = this.roleService.getCurrentRole();
        this.router.navigate([({
          [Roles.Creator]: '/founder',
          // [Roles.Backer]: '/backer',
          [Roles.Employee]: '/employee',
        })[role]]);
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  goBack() {
    const options = this.backNavOptions;

    if (this.onBackClicked.observers.length > 0) {
      this.onBackClicked.emit();
      return;
    }

    if(<any>options == null) {
      console.log('goBack(): default location.back()');
      this.location.back();
      return;
    }

    if (options.url) {
      console.log('goBack() options.url');
      this.router.navigateByUrl(options.url);
    } else if (options.route) {
      console.log('goBack(): options.route');
      this.router.navigate(options.route);
    } else {
      console.log('goBack(): location.back()');
      this.location.back();
    }
  }
}
