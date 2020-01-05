import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KanbanboardNewGoalComponent } from './newgoal/newgoal.component';
import { KanbanboardEditGoalComponent } from './editgoal/editgoal.component';
import { KanbanBoardComponent } from './kanban-board/kanban-board.component';


const routes: Routes = [
  {
    path: 'newgoal',
    component: KanbanboardNewGoalComponent,
  }, {
    path: 'editgoal/:goalId',
    component: KanbanboardEditGoalComponent,
  }, {
    path: '',
    component: KanbanBoardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KanbanBoardRoutingModule {
}
