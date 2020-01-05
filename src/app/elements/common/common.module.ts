import { NgModule } from '@angular/core';
import { ChangeLogComponent } from './change-log/change-log.component';
import { CommonModule as NgCommonModule } from '@angular/common';

@NgModule({
  imports: [
    NgCommonModule,
  ],
  declarations: [
    ChangeLogComponent,
  ],
  exports: [
    ChangeLogComponent,
  ]
})
export class CommonModule {
}
