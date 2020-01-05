import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

import { STARTUP_STAGES } from '../startup.constants';


@Component({
  selector: 'app-founder-startup',
  templateUrl: './overview.component.html',
  styleUrls: [
    './overview.component.scss',
  ],
  animations: [
    trigger('pageState', [
      state('visible', style({
        opacity: 1,
      })),
      state('hidden', style({
        opacity: 0,
      })),
      transition('* => visible', [
        animate(300, keyframes([
          style({opacity: 0, transform: 'scale(0.1)', offset: 0}),
          style({opacity: 1, transform: 'scale(0.7)', offset: 1.0}),
        ])),
      ]),
      transition('visible => *', [
        animate(300, keyframes([
          style({opacity: 1, transform: 'scale(0.7)', offset: 0}),
          style({opacity: 0, transform: 'scale(0.1)', offset: 1.0}),
        ])),
      ]),
    ]),
  ],
  providers: [],
})
export class FounderStartupOverviewComponent implements OnInit {
  pageState: string;
  targetUrl: string;
  menus = STARTUP_STAGES;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.pageState = 'visible';
  }

  public animationDone(event) {
    if (event.triggerName === 'pageState' && event.toState === 'hidden') {
      this.router.navigate([this.targetUrl]);
    }
  }

  navigateTo(menu: any) {
    if (menu.enabled) {
      this.targetUrl = menu.url;
      this.pageState = 'hidden';
      this.router.navigate([menu.url], {relativeTo: this.route});
    }
  }
}
