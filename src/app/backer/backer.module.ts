import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule, NgbPopoverModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { BackerRoutingModule } from './backer.routing';
import { NavbarModule } from 'app/core/navbar/navbar.module';
import { BackerHomeComponent } from './home/home.component';
import { AppPipesModule } from 'app/pipes/pipes.module';
import { MyPrimeNgModule } from 'app/my-prime-ng.module';
import { AppElementsModule } from '../elements/elements.module';

@NgModule({
  imports: [
    CommonModule,
    NavbarModule,
    AppPipesModule,
    FormsModule,
    NgbPopoverModule,
    NgbCollapseModule,
    NgbTooltipModule,
    BackerRoutingModule,
    MyPrimeNgModule,
    AppElementsModule,
  ],
  declarations: [
    BackerHomeComponent,
  ],
})
export class BackerModule {
}
