import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {trigger, state, style, animate, transition, keyframes} from '@angular/animations';

@Component({
  selector: 'app-trading-type',
  templateUrl: './trading-type.component.html',
  styleUrls: ['./trading-type.component.scss'],
  animations: [
    trigger('pageState', [
      state('visible', style({
        opacity: 1
      })),
      state('hidden', style({
        opacity: 0
      })),
      transition('* => visible', [
        animate(500, keyframes([
          style({opacity: 0, transform: 'scale(0.1)', offset: 0}),
          style({opacity: 1, transform: 'scale(0.7)', offset: 1})
        ]))
      ]),
      transition('visible => *', [
        animate(500, keyframes([
          style({opacity: 1, transform: 'scale(0.7)', offset: 0}),
          style({opacity: 0, transform: 'scale(0.1)', offset: 1.0})
        ]))
      ])
    ])
  ]
})
export class TradingTypeComponent implements OnInit {
  project_id: number;
  pageState = 'visible';
  constructor(private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
   
  }

  shownextpage(pagename){
    this.pageState = 'hidden';
    this.router.navigate([pagename], { relativeTo: this.route });
  }
  
  public animationDone(event) {
    if (event.triggerName === 'pageState' && event.toState === 'hidden') {
    }
  }
}
