import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KanbanHomeComponent } from './kanban-home/kanban-home.component';

const routes: Routes = [
  {
    path: '',
    component: KanbanHomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackerKanbanboardRoutingModule { }
