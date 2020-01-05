import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { AccountService } from 'app/founder/account/account.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
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
          style({ opacity: 0, transform: 'scale(0.1)', offset: 0 }),
          style({ opacity: 1, transform: 'scale(0.7)', offset: 1 })
        ]))
      ]),
      transition('visible => *', [
        animate(500, keyframes([
          style({ opacity: 1, transform: 'scale(0.7)', offset: 0 }),
          style({ opacity: 0, transform: 'scale(0.1)', offset: 1.0 })
        ]))
      ])
    ])
  ]
})
export class WalletComponent implements OnInit {
  project_id: number;
  pageState = 'visible';
  popOverMessage:string;
  constructor(private router: Router,
    private route: ActivatedRoute, private accountService: AccountService) { }

  ngOnInit() {
  }

  bankaccount(popover) {
      this.accountService.getProfile().subscribe((data)=>{
      if(data.first_name && data.last_name && data.email && data.address && data.ssn && data.date_of_birth){
        //this.pageState = 'hidden';
        this.router.navigate(['/founder/bank-account']);
      }
      else {
        popover.open();
        this.popOverMessage = 'Please add email, name, address, ssn and DOB in your profile';
      }
      console.log('user profile', data);
    });  
  }

  closePopoverpWithDelay(timer: number, popover) {
    setTimeout(() => {
      popover.close();
    }, timer);
  }

  transactions() {
    //this.pageState = 'hidden';
    this.router.navigate(['/founder/transactions']);
  }
  tradeHistory() {
    this.pageState = 'trade-history';
    this.router.navigate(['/founder/trade-history']);
  }
  public animationDone(event) {
    if (event.triggerName === 'pageState' && event.toState === 'hidden') {
    }
  }

}
