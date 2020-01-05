import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbDropdownModule, NgbPopoverModule} from '@ng-bootstrap/ng-bootstrap';

import {NavBarComponent} from './navbar.component';
import {ProfileMenuComponent} from './profile-menu/profile-menu.component';

@NgModule({
  imports: [
    CommonModule,
    NgbDropdownModule,
    NgbPopoverModule
  ],
  declarations: [
    NavBarComponent,
    ProfileMenuComponent
  ],
  exports: [
    NavBarComponent
  ]
})
export class NavbarModule { }
