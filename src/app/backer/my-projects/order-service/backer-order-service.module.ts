import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import {
  NgbModule,
  NgbPopoverModule
} from '@ng-bootstrap/ng-bootstrap';
import { AppElementsModule } from 'app/elements/elements.module';
import { AppPipesModule } from 'app/pipes/pipes.module';

import { MyPrimeNgModule } from 'app/my-prime-ng.module';
import { OrderService } from 'app/founder/order-service/services/order.service';
import { BackerServiceOrdersComponent } from './overview/current-past-all-orders/backer-service-orders.component';
import { BackerServiceOverviewComponent } from './overview/backer-service-overview.component';
import { BackerOrderServiceRouting } from './backer-order-service.routing';
import { BackerServiceWorkAreaModule } from './backer-service-work-area/backer-service-work-area.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgbPopoverModule,
    MyPrimeNgModule,
    AppPipesModule,
    AppElementsModule,
    BackerOrderServiceRouting,
    BackerServiceWorkAreaModule
  ],
  providers: [OrderService],
  declarations: [BackerServiceOverviewComponent, BackerServiceOrdersComponent]
})
export class BackerOrderServiceModule { }
