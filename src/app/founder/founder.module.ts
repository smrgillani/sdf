import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NavbarModule } from 'app/core/navbar/navbar.module';
import { FounderRoutingModule } from './founder.routing';
import { FounderHomeComponent } from './home/home.component';
import { MyPrimeNgModule } from 'app/my-prime-ng.module';
import { HomeNavBarComponent } from './home/navbar/navbar.component';
import { NgbDropdownModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { AppElementsModule } from 'app/elements/elements.module';
// import { SharedModule } from 'app/shared/shared.module';
// import { WebCamComponent } from 'ack-angular-webcam';
import { CommonComponentModule } from 'app/common/common.module';
import { ConfirmationService } from 'primeng/primeng';
import { MaterialModule } from 'app/material.module';


@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    NavbarModule,
    FounderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MyPrimeNgModule,
    NgbDropdownModule,
    NgbPopoverModule,
    AppElementsModule,
    CommonComponentModule,
    // SharedModule
  ],
  declarations: [
    FounderHomeComponent,
    HomeNavBarComponent,
  ],
  providers: [ConfirmationService],
})
export class FounderModule {
}
