import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-founder-ready',
  templateUrl: './ready.component.html',
  styleUrls: [
    './ready.component.css',
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
          style({opacity: 1, transform: 'scale(1)', offset: 1.0}),
        ])),
      ]),
      transition('visible => *', [
        animate(300, keyframes([
          style({opacity: 1, transform: 'scale(1)', offset: 0}),
          style({opacity: 0, transform: 'scale(0.1)', offset: 1.0}),
        ])),
      ]),
    ]),
  ],
})
export class FounderReadyComponent implements OnInit {
  pageState = 'visible';

  constructor(private router: Router) {
  }

  ngOnInit() {
  }
}
