import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskDashboardComponent } from './task-dashboard.component';
import { TodolistComponent } from './todolist/todolist.component';
//import {FounderProjectDetailsBoardsComponent} from '../boards/boards.component'

const routes: Routes = [
  // {
  //   path: '',
  //   component: TaskDashboardComponent
  // },
  {
    path: '',
    component: TodolistComponent
  }/*,
  {
    path: 'boards',
    component: FounderProjectDetailsBoardsComponent
  },*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskDashboardRoutingModule { }
