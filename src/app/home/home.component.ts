import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {trigger, state, style, animate, transition, keyframes} from '@angular/animations';

import {AuthService} from 'app/auth/auth.service';
import {LoginService, TokenResponse} from '../auth/login.service';


@Component({
  selector: 'app-root',
  templateUrl: './home.component.html',
   styleUrls: [
     './home.component.scss'
   ],
  animations: [
    trigger('pageState', [
      state('visible', style({
        opacity: 1
      })),
      state('hidden', style({
        opacity: 0
      })),
      transition('* => visible', [
        animate(300, keyframes([
          style({opacity: 0, transform: 'scale(0.1)', offset: 0}),
          style({opacity: 1, transform: 'scale(0.7)', offset: 1.0})
        ]))
      ]),
      transition('visible => *', [
        animate(300, keyframes([
          style({opacity: 1, transform: 'scale(0.7)', offset: 0}),
          style({opacity: 0, transform: 'scale(0.1)', offset: 1.0})
        ]))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  pageState: string;
  targetUrl: string;

  constructor(
    private router: Router,
    private auth: AuthService,
    private loginService: LoginService
  ) {
  }

  ngOnInit() {
    this.pageState = 'visible';
  }

  navigateTo(url: string) {
    this.targetUrl = url;
    this.pageState = 'hidden';
  }

  public animationDone(event) {
    if (event.triggerName === 'pageState' && event.toState === 'hidden') {
      this.router.navigate([this.targetUrl]);
    }
  }

  signUpLater() {
   
    this.loginService.temporaryLogin()
      .subscribe(
        (response: TokenResponse) => {
        //  this.pageState = 'hidden';
          this.auth.loginTemporary(response.token);
          this.navigateTo('role');
         // this.router.navigate(['/role']);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }
}
