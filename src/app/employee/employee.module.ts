import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee.routing';
import { AccountComponent } from './account/account.component';
import { NavbarModule } from 'app/core/navbar/navbar.module';
import { HomeComponent } from './home/home.component';
import { NgbDropdownModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { AppElementsModule } from 'app/elements/elements.module';
import { MyPrimeNgModule } from 'app/my-prime-ng.module';

@NgModule({
  imports: [
    CommonModule,
    NavbarModule,
    EmployeeRoutingModule,
    NgbDropdownModule,
    NgbPopoverModule,
    AppElementsModule,
    MyPrimeNgModule,
  ],
  declarations: [
    AccountComponent,
    HomeComponent,
  ],
})
export class EmployeeModule {
}
