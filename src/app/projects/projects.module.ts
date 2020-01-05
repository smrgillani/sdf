import { NgModule } from '@angular/core';
import { FilterProjectStagePipe } from './pipes/filter-project-stage.pipe';
import { FilterVisiblePipe } from './pipes/filter-visible.pipe';
import { SearchProjectPipe } from './pipes/search-project.pipe';
import { OperationsComponent } from './operations/operations.component';
import { AppElementsModule } from 'app/elements/elements.module';
import { CommonModule } from '@angular/common';
import { SlickModule } from 'ngx-slick';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MilestoneFormComponent } from './operations/milestone-form/milestone-form.component';
import { MyPrimeNgModule } from '../my-prime-ng.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { MilestonesService } from './milestones.service';

@NgModule({
  imports: [
    CommonModule,
    AppElementsModule,
    SlickModule,
    MyPrimeNgModule,
    FormsModule,
    PerfectScrollbarModule.forChild(),
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 3,
      innerStrokeWidth: 3,
      outerStrokeColor: '#f58901',
      innerStrokeColor: '#dfdfdf',
      animationDuration: 300,
      animation: true,
      responsive: true,
      space: 0,
    }),
  ],
  declarations: [
    FilterProjectStagePipe,
    FilterVisiblePipe,
    SearchProjectPipe,
    MilestoneFormComponent,
    OperationsComponent,
  ],
  exports: [
    FilterProjectStagePipe,
    FilterVisiblePipe,
    SearchProjectPipe,
    OperationsComponent,
  ],
  providers: [
    MilestonesService,
  ]
})
export class AppProjectsModule {
}
