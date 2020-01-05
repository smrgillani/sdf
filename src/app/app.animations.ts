import {trigger, state, style, animate, transition, keyframes} from '@angular/animations';

export function routerFadeTransition() {
  return trigger('routeAnimation', [
    transition(':enter', [
      animate('0.1s cubic-bezier(0.215, 0.610, 0.355, 1.000)', keyframes([
        style({opacity: 0.5, offset: 0}),
        style({opacity: 1, offset: 1.0})
      ]))
    ])
  ]);
}

export function scaleAnimation(duration: number, scaleFrom: number, scaleTo: number) {
  return animate(duration, keyframes([
    style({transform: 'scale(' + scaleFrom + ')', offset: 0}),
    style({transform: 'scale(' + scaleTo + ')', offset: 1})
  ]));
}

export function fadeAnimation(duration: number, alphaFrom: number, alphaTo: number) {
  return animate(duration, keyframes([
    style({opacity: alphaFrom, offset: 0}),
    style({opacity: alphaTo, offset: 1})
  ]));
}
