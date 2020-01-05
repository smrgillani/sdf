import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-founder-idea-first',
  templateUrl: './first.component.html',
  styleUrls: [
    './first.component.css',
    './first.component.portrait.css',
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
})
export class IdeaFirstComponent implements OnInit {
  pageState = 'visible';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
  }

  public setProjectType(projectType: string) {
    if (projectType === 'new') {
      this.router.navigate(['../ready'], {relativeTo: this.route});
    }
  }
}
