import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';

import {QAComponent} from './qa/qa.component';
import {AppElementsModule} from 'app/elements/elements.module';


@NgModule({
  imports: [
    AppElementsModule,
    CommonModule,
    FormsModule,
    PerfectScrollbarModule.forRoot(),
  ],
  exports: [
    QAComponent
  ],
  declarations: [
    QAComponent
  ]
})
export class AppQuestionnaireModule {}
