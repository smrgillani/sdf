

import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TestComponent} from'./test.component';
import {TestRoutingModule} from './test.routing';
import {MyPrimeNgModule} from '../my-prime-ng.module';
import { AppElementsModule } from '../elements/elements.module';

//import { DataSvc } from './services/DataSvc';
import { WjChartFinanceModule } from 'wijmo/wijmo.angular2.chart.finance';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TestRoutingModule,
    AppElementsModule,
    MyPrimeNgModule,
    WjChartFinanceModule
  ],
  declarations: [
    TestComponent
  ]
})

export class TestModule {}
