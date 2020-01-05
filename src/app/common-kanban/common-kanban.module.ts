import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { jqxKanbanComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxkanban';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [jqxKanbanComponent],
  exports: [jqxKanbanComponent]
})
export class CommonKanbanModule { }
