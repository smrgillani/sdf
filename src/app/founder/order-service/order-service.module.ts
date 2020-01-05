import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { FileDroppa } from 'file-droppa/lib/index';

import { MyPrimeNgModule } from '../../my-prime-ng.module';
import {
  NgbModule,
  NgbPopoverModule,
  // NgbRating,
  // NgbCollapseModule
} from '@ng-bootstrap/ng-bootstrap';

import { OrderServiceRoutingModule } from './order-service-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { AppElementsModule } from 'app/elements/elements.module';
import { NewServiceComponent } from './new-service/new-service.component';
import { OrderService } from './services/order.service';
import { CurrentPastAllOrdersComponent } from './overview/current-past-all-orders/current-past-all-orders.component';
import { RateSlabComponent } from './rate-slab/rate-slab.component';
import { BreakUpComponent } from './break-up/break-up.component';
import { AppPipesModule } from 'app/pipes/pipes.module';
import { UpdatedNewServiceComponent } from './updated-new-service/updated-new-service.component';
import { ServiceWorkAreaComponent } from './service-work-area/service-work-area.component';
import { CreatorServiceWorkAreaModule } from 'app/founder/order-service/creator-service-work-area/creator-service-work-area.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgbPopoverModule,
    MyPrimeNgModule,
    FileDroppa,
    AppPipesModule,
    AppElementsModule,
    OrderServiceRoutingModule,
    CreatorServiceWorkAreaModule,
  ],
  providers: [OrderService],
  declarations: [
    OverviewComponent,
    NewServiceComponent,
    CurrentPastAllOrdersComponent,
    RateSlabComponent,
    BreakUpComponent,
    UpdatedNewServiceComponent,
    ServiceWorkAreaComponent,
  ],
  entryComponents: [RateSlabComponent, BreakUpComponent],
})
export class OrderServiceModule {
}
