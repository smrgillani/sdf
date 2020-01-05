import {Component} from '@angular/core';
import {ProfileEditSession} from './edit/ProfileEditSession';

@Component({
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  providers: [ProfileEditSession]
})
export class AccountComponent {}
