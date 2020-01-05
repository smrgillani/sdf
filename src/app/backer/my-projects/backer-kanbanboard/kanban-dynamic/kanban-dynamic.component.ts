import { Component, OnInit, ViewEncapsulation, ViewChild, ViewContainerRef } from '@angular/core';
import 'jqwidgets-framework/jqwidgets/jqx-all';
import { jqxKanbanComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxkanban';
import { ActivatedRoute, Router } from '@angular/router';

import TaskModel from 'app/core/models/TaskModel';
import { TasksService } from 'app/projects/tasks.service';

@Component({
  selector: 'app-kanban-dynamic',
  templateUrl: './kanban-dynamic.component.html',
  styleUrls: ['./kanban-dynamic.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class KanbanDynamicComponent implements OnInit {

  @ViewChild('myKanbanboard') myKanbanboard: jqxKanbanComponent;
  @ViewChild('dynamicComponentContainer', {
    read: ViewContainerRef
  }) container: ViewContainerRef;

  result: any;
  tasks: TaskModel[];
  project: number;

  dataAdapter: any;
  fields: any[] = [{
    name: 'id',
    type: 'string'
  }, {
    name: 'title',
    map: 'name',
    type: 'string'
  }, {
    name: 'status',
    map: 'state',
    type: 'string'
  }, {
    name: 'text',
    map: 'label',
    type: 'string'
  }, {
    name: 'tags',
    type: 'string'
  },
  {
    name: 'color',
    map: 'hex',
    type: 'string'
  }, {
    name: 'resourceId',
    map: 'resourceId',
    type: 'number'
  }, {
    name: 'order',
    type: 'number'
  }
  ];

  columns = [];

  source: any = {
    localData: [],
    dataType: 'array',
    dataFields: this.fields
  };

  resourcesSource: any = {
    localData: [],
    dataType: 'array',
    dataFields: [{
      name: 'id',
      type: 'number'
    },
    {
      name: 'name',
      type: 'string'
    },
    {
      name: 'desc',
      type: 'string'
    },
    ]
  };

  template =
    '<div class="jqx-kanban-item" id="">' +
    '<div class="jqx-kanban-item-color-status"></div>' +
    '<div style="display: none;" class="jqx-kanban-item-avatar"></div>' +
    '<div class="jqx-icon jqx-icon-close jqx-kanban-item-template-content jqx-kanban-template-icon"></div>' +
    '<div class="jqx-kanban-item-text"></div>' +
    '<div style="display: none;" class="jqx-kanban-item-footer"></div>' +
    '<div class="text-right" style="postion:absalute; bottom: 5px; right: 5px;">' +
    '<span class="icon-compare"></span>' +
    '</div>' +
    '</div>';

  log: any[] = [];

  constructor(private kanbanService: TasksService,
    private route: ActivatedRoute,
    private router: Router) {

    this.source.localData = JSON.parse(localStorage.getItem('localDataSource')) || [];
    if (!this.source.localData.length) {
      this.source.localData.push({});
    }
    this.resourcesSource.localData = JSON.parse(localStorage.getItem('localDataResource'));
    this.dataAdapter = new jqx.dataAdapter(this.source);

    this.kanbanService.getStatuses()
      .subscribe((statuses: any[]) => {
        statuses.forEach((item) => {
          item['text'] = item.title;
          item['iconClassName'] = 'jqx-icon-plus-alt';
          item['dataField'] = item.id;
          item['maxItems'] = 16;
          item['collapsible'] = false;
        });
        this.columns = statuses;
      });
    this.project = this.route.snapshot.params['id'];
  }

  ngOnInit() {
  }

  resourcesAdapterFunc(): any {
    return new jqx.dataAdapter(this.resourcesSource);
  }

  columnRenderer(element: any, collapsedElement: any, column: any): void { }

  itemRenderer = (element: any, item: any, resource: any): void => {
    const self = this;
    const tasks = JSON.parse(localStorage.getItem('localDataSource'));
    let taskid;
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id.toString() === item.id) { taskid = tasks[i].taskId; }
    }

    let tasks_itemid_originid = JSON.parse(localStorage.getItem('tasks_itemid_originid'));
    if (tasks_itemid_originid == null) { tasks_itemid_originid = []; }
    tasks_itemid_originid.push({
      'itemid': element[0].id,
      'originid': taskid
    });
    localStorage.setItem('tasks_itemid_originid', JSON.stringify(tasks_itemid_originid));

    element[0].getElementsByClassName('jqx-kanban-item-color-status')[0].innerHTML = '<span style="line-height: 23px; ' +
      'margin-left: 5px;">' + resource.name + '</span>';

    const container = element[0].getElementsByClassName('jqx-kanban-item-text')[0];
    const containerEvent = element[0].getElementsByClassName('icon-compare')[0];
    var flipCard = () =>{
      const context = element[0].getElementsByClassName('jqx-kanban-item-text')[0];
      if (context.innerHTML.indexOf('<li') === -1) {

        this.kanbanService.get(taskid)
          .subscribe((response) => {
            container.innerHTML = '<li style=\'display:none;\'></li>';
            const arr = [];

            for (let j = 0; j < response.subtasks.length; j++) {
              this.kanbanService.get(response.subtasks[j])
                .subscribe((resp) => {
                  // const arr_temp = arr;
                  arr.push(resp);
                  arr.sort(this.compareById);
                  container.innerHTML = '';
                  
                  if (arr.length == response.subtasks.length) {
                    for (let i = 0; i < arr.length; i++) {
                      const newSlideItem = document.createElement("li");
                      const newSlideText = document.createTextNode(arr[i].title);
                      newSlideItem.className = 'btn-link';
                      newSlideItem.appendChild(newSlideText);
                      container.children.length > 0 ? container.insertBefore(newSlideItem, container.children[i]) : container.appendChild(newSlideItem);                      
                      let processId = arr[i].id;

                      /* click for others */
                      container.children[i].addEventListener("click", function () {
                        self.router.navigate([`backer/my-projects/${self.project}/collaboration`, {
                          outlets: {
                            documents: ['process', processId],
                            chat: ['chat', processId]
                          }
                        }]);
                      });

                      /* touchstart for IOS */
                      container.children[i].addEventListener("touchstart", function () {
                        self.router.navigate([`backer/my-projects/${self.project}/collaboration`, {
                          outlets: {
                            documents: ['process', processId],
                            chat: ['chat', processId]
                          }
                        }]);
                      });
                    }
                  }                  
                });
            }
          });

      } else {
        context.innerHTML = item.text;
      }
    }
    containerEvent.addEventListener('click', (): void => {
      flipCard();
    });

    containerEvent.addEventListener('touchstart', (): void => {
      flipCard();
    });
  }

  myKanbanboardOnItemMoved(event: any): void {
    let order;

    const el = document.getElementsByClassName('jqx-kanban-item');
    for (let i = 0; i < el.length; i++) {
      const id_attr = el[i]['id'];
      if (id_attr.indexOf('_' + event.args.itemData.resourceId) !== -1) {
        const elem = document.getElementById(id_attr);
        order = Array.prototype.slice.call(elem.parentElement.children).indexOf(elem);
      }
    }

    this.updateStatusAndOrder(
      event.args.itemData.resourceId,
      event.args.newColumn.dataField,
      order
    );
  };

  updateStatusAndOrder(task_id: number, status: number, order: number) {
    let data_newtask: any;
    this.kanbanService.get(task_id).subscribe(resp => {
      data_newtask = {
        'title': resp.title,
        'milestone': resp.milestone,
        'status': status,
        'order': order
      };
      this.kanbanService.updateTask(task_id, data_newtask)
        .subscribe((response) => {
          this.updateLocalData();
        });
    });
  }

  updateLocalData() {
    const localDataResource = [];
    let milestone_id;
    this.route.params.subscribe((params) => {
      milestone_id = params['milestoneId'];
    });
    this.kanbanService.listByMilestone(milestone_id)
      .subscribe((response) => {
        this.tasks = response;

        const databystatus = new Array(4);
        for (let i = 0; i < 4; i++) {
          databystatus[i] = [];
        }

        this.tasks.forEach((task) => {
          if (task.parent_task == null && milestone_id === task.milestone.toString()) {
            const item = {
              id: task.id,
              name: task.title,
              state: task.status,
              label: task.description,
              tags: task.tags[0],
              hex: task.color, //'#36c7d0',
              resourceId: task.id,
              taskId: task.id,
              order: task.order
            };
            databystatus[task.status - 1].push(item);

            localDataResource.push({
              id: task.id,
              name: task.title,
              desc: task.description,
            });
          }
        });

        let localData = [];
        for (let i = 0; i < 4; i++) {
          databystatus[i].sort(this.compare);
          localData = localData.concat(databystatus[i]);
        }

        localStorage.setItem('localDataSource', JSON.stringify(localData));
        localStorage.setItem('localDataResource', JSON.stringify(localDataResource));
      });
  }

  compare(a: TaskModel, b: TaskModel) {
    if (a.order < b.order) {
      return -1;
    } else {
      return 1;
    }
  }

  compareById(a: TaskModel, b: TaskModel) {
    if (a.id < b.id) {
      return -1;
    } else {
      return 1;
    }
  }

}
