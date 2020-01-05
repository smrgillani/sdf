import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {FounderProjectDetailsBoardsComponent} from './boards.component';

const routes: Routes = [
  {
    path: '',
    component: FounderProjectDetailsBoardsComponent
  },
  {
    path: ':milestoneId',
    loadChildren: 'app/founder/projects/details/boards/kanban-board/kanban-board.module#KanbanBoardModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FounderProjectsDetailsBoardsRoutingModule {}
