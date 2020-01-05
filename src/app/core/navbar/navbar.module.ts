import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormGroup, FormBuilder, NgForm, FormsModule } from '@angular/forms';
import {NgbDropdownModule, NgbPopoverModule} from '@ng-bootstrap/ng-bootstrap';

import {NavBarComponent} from './navbar.component';
import {ProfileMenuComponent} from './profile-menu/profile-menu.component';

@NgModule({
  imports: [
    CommonModule,
    NgbDropdownModule,
    NgbPopoverModule,
    FormsModule
  ],
  declarations: [
    NavBarComponent,
    ProfileMenuComponent
  ],
  exports: [
    NavBarComponent,
    ProfileMenuComponent
  ]
})
export class NavbarModule { }
