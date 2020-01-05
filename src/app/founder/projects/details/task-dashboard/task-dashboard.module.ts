import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  NgbPopoverModule,
  NgbCollapseModule,
  NgbTooltipModule,
  NgbModule,
  NgbDateStruct,
  NgbAccordion
} from '@ng-bootstrap/ng-bootstrap';
import { Ng2DatetimePickerModule } from 'ng2-datetime-picker';
import {NavbarModule} from 'app/core/navbar/navbar.module';
import {MyPrimeNgModule} from '../../../../my-prime-ng.module';
import { TaskDashboardRoutingModule } from './task-dashboard-routing.module';
import { TaskDashboardComponent } from './task-dashboard.component';
import { TodolistComponent } from './todolist/todolist.component';
import {AppElementsModule} from 'app/elements/elements.module';
import {ProjectsService} from 'app/projects/projects.service';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    NgbPopoverModule,
    NgbCollapseModule,
    NgbTooltipModule,
    Ng2DatetimePickerModule,
    NavbarModule,
    FormsModule,
    ReactiveFormsModule,
    MyPrimeNgModule,   
    AppElementsModule,
    TaskDashboardRoutingModule,
    PerfectScrollbarModule.forChild(),

  ],
  declarations: [TaskDashboardComponent, TodolistComponent],
  providers: [ProjectsService]
})
export class TaskDashboardModule { }
