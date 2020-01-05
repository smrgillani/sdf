import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import TaskModel from 'app/core/models/TaskModel';
import {DocumentExplorerItem} from 'app/elements/document-explorer/DocumentExplorerItem';
import {FolderNavigation} from 'app/elements/document-explorer/FolderNavigation';
import {TasksService} from 'app/projects/tasks.service';
import {ProcessItem} from 'app/collaboration/document-explorer/ProcessItem';
import {GoalItem} from 'app/collaboration/document-explorer/GoalItem';


@Component({
  template: `
    <app-document-explorer *ngIf="goal"
                           [is_goal]="true"
                           [items]="subtasks"
                           (open)="openProcess($event)"
                           (createDocument)="createDocument($event)"></app-document-explorer>
  `,
  styles: [`
  `]
})
export class CollaborationGoalProcessesComponent implements OnInit {
  goal: GoalItem;
  subtasks: DocumentExplorerItem[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private folderNavigation: FolderNavigation,
    private tasksService: TasksService
  ) {
    this.subtasks = [];
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const goalId = params['goalId'];
      this.tasksService.get(goalId).subscribe((goal: TaskModel) => {
        this.goal = new GoalItem(goal);
        this.folderNavigation.opened.emit(this.goal);
        this.subtasks = [];
        for (const subtaskId of goal.subtasks) {
          this.tasksService.get(subtaskId).subscribe((subtask: TaskModel) => {
            this.subtasks.push(new ProcessItem(subtask));
          });
        }
      });
    });
  }

  createDocument(type: string) {
    this.router.navigate([{
      outlets: {
        documents: ['document', 'new', {type: type}]
      }
    }], {relativeTo: this.route.parent});
  }

  openProcess(processItem: ProcessItem) {
    this.router.navigate([{
      outlets: {
        documents: ['process', processItem.resource.id],
        chat: ['chat', processItem.resource.id]
      }
    }], {relativeTo: this.route.parent});
  }
}
