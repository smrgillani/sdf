import {
  Component,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  ComponentFactory,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MilestonesService } from 'app/projects/milestones.service';
import { TasksService } from 'app/projects/tasks.service';
import { ProjectsService } from 'app/projects/projects.service';
import TaskModel from 'app/core/models/TaskModel';
import ProjectModel from 'app/projects/models/ProjectModel';
import { KanbanDynamicComponent } from '../kanban-dynamic/kanban-dynamic.component';

@Component({
  templateUrl: './kanban-home.component.html',
  styleUrls: ['./kanban-home.component.scss'],
  entryComponents: [KanbanDynamicComponent],
  encapsulation: ViewEncapsulation.None,
})
export class KanbanHomeComponent {
  @ViewChild('dynamicComponentContainer', {read: ViewContainerRef}) container: ViewContainerRef;
  componentRef: ComponentRef<any>;
  localData: any[] = [];
  tasks: TaskModel[];
  is_edit = false;
  is_add = false;
  edit_btn_class = 'edit-svg-btn';
  milestone_id: number;
  localDataResource: any[] = [];
  milestone_title: string;
  project_id: number;
  project: ProjectModel;

  constructor(
    private milestoneService: MilestonesService,
    private kanbanService: TasksService,
    private projectsService: ProjectsService,
    private resolver: ComponentFactoryResolver,
    private route: ActivatedRoute,
  ) {
    this.project = {
      title: '',
      stage: 'idea',
      is_visible: true,
      status: 'draft',
    } as ProjectModel;
    this.getProjectAndMilestoneId();
  }

  initComponent() {
    localStorage.removeItem('localData');
    localStorage.removeItem('localDataSource');
    localStorage.removeItem('localDataResource');
    localStorage.removeItem('project_id');
    localStorage.removeItem('milestone_id');
    localStorage.removeItem('edit_item');
    localStorage.removeItem('taskcountByStatus');
    localStorage.removeItem('project_name');
    localStorage.removeItem('tasks_itemid_originid');
  }

  getProjectAndMilestoneId() {
    this.initComponent();
    this.route.params.subscribe((params) => {
      this.milestone_id = params['milestoneId'];
      this.project_id = params['id'];
      this.projectsService.getForBacker(params['id']).subscribe((project) => {
        this.project = project;
        this.getResourcesAndCreateComponent();
      });
    });
  }

  getResourcesAndCreateComponent() {
    this.milestoneService.getMilestoneForBacker(this.project_id, this.milestone_id).subscribe((response) => {
      this.milestone_title = response.title;
    });

    localStorage.setItem('milestone_id', this.milestone_id.toString());
    this.kanbanService.listByMilestone(this.milestone_id)
      .subscribe((response) => {
        this.tasks = response;

        const databystatus = new Array(5);
        const taskcountByStatus = new Array(5);
        for (let i = 0; i < 5; i++) {
          databystatus[i] = [];
        }

        this.localData = [];
        this.localDataResource = [];
        this.tasks.forEach((task, index, arr) => {
          if (task.parent_task == null && this.milestone_id === task.milestone) {
            const item = {
              id: task.id,
              name: task.title,
              state: task.status,
              label: task.description,
              tags: task.tags[0],
              hex: task.color, // '#36c7d0',
              resourceId: task.id,
              taskId: task.id,
              order: task.order,
            };

            databystatus[task.status - 1].push(item);

            this.localDataResource.push({
              id: task.id,
              name: task.title,
              desc: task.description,
            });
          }
        });

        for (let i = 0; i < 5; i++) {
          databystatus[i].sort(this.compare);
          this.localData = this.localData.concat(databystatus[i]);
          taskcountByStatus[i] = databystatus[i].length;
        }

        if (this.localData === null) {
          this.localData = [];
        }

        localStorage.setItem('localDataSource', JSON.stringify(this.localData));
        localStorage.setItem('localDataResource', JSON.stringify(this.localDataResource));
        localStorage.setItem('taskcountByStatus', JSON.stringify(taskcountByStatus));
        this.createComponent();
      });
  }

  compare(a: TaskModel, b: TaskModel) {
    if (a.order < b.order) {
      return -1;
    } else {
      return 1;
    }
  }

  createComponent() {
    this.container.clear();
    const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(KanbanDynamicComponent);
    this.componentRef = this.container.createComponent(factory);

    this.componentRef.instance.isEdit = this.is_edit;
  }
}
