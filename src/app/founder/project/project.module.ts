import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {MyPrimeNgModule} from '../../my-prime-ng.module';
import {ProjectRoutingModule} from './project.routing';
import {ResponsiveModule} from 'ng2-responsive';
import { ProjectListComponent } from './list/list.component';
import { ProjectRegisterComponent } from './register/register.component';
import { ProjectInsidePublicComponent } from './inside/public/public.component';
import { ProjectInsidePrivateComponent } from './inside/private/private.component';
import { ProjectDeskComponent } from './desk/desk.component';
import { FounderProjectNavBarComponent } from './navbar/navbar.component';
import {KanbanExampleComponent} from './kanban-example/kanban-example.component';
import {jqxKanbanComponent} from 'jqwidgets-framework/jqwidgets-ts/angular_jqxkanban';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProjectRoutingModule,
    ResponsiveModule,

    MyPrimeNgModule
  ],
  declarations: [
    ProjectListComponent,
    ProjectRegisterComponent,
    ProjectInsidePublicComponent,
    ProjectInsidePrivateComponent,
    ProjectDeskComponent,
    FounderProjectNavBarComponent,
    KanbanExampleComponent,
    jqxKanbanComponent
  ]
})
export class ProjectModule {}
