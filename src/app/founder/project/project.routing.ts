import { NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ProjectListComponent} from './list/list.component';
import {ProjectRegisterComponent} from './register/register.component';
import {ProjectInsidePublicComponent} from './inside/public/public.component';
import {ProjectInsidePrivateComponent} from './inside/private/private.component';
import {ProjectDeskComponent} from './desk/desk.component';
import {KanbanExampleComponent} from './kanban-example/kanban-example.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectListComponent,
  },
  {
    path: 'inside/public',
    component: ProjectInsidePublicComponent
  },
  {
    path: 'inside/private',
    component: ProjectInsidePrivateComponent
  },
  {
    path: 'register',
    component: ProjectRegisterComponent
  },
  {
    path: 'desk',
    component: ProjectDeskComponent
  },
  {
    path: 'kanban-example',
    component: KanbanExampleComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule {}
