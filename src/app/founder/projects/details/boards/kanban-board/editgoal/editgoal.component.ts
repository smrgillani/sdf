import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  NgbModal,
  NgbModalOptions,
  NgbModalRef
} from '@ng-bootstrap/ng-bootstrap';
import { ProcessComponent } from '../newgoal/processDirective/process.component';
import { TasksService } from 'app/projects/tasks.service';
import { AccountService } from 'app/founder/account/account.service';
import UserProfileModel from 'app/core/models/UserProfileModel';
import { ProjectsService } from 'app/projects/projects.service';
import ProjectModel from 'app/projects/models/ProjectModel';
import TaskModel from 'app/core/models/TaskModel';
import { MilestonesService } from 'app/projects/milestones.service';
import { LoaderService } from 'app/loader.service';
import MilestoneModel from 'app/projects/models/MilestoneModel';
import ParentDependancyModel from 'app/core/models/ParentDependancyModel';

@Component({
  templateUrl: './editgoal.component.html',
  entryComponents: [ProcessComponent],
  styleUrls: [
    './editgoal.component.scss'

  ],
  providers: [TasksService]

})
export class KanbanboardEditGoalComponent implements OnInit {
  goal: TaskModel;
  milestone_id: number;
  project_id: number;
  current_user: UserProfileModel;
  subtasks: TaskModel[];
  project: ProjectModel;
  milestones: any[];
  dependencies: any[];
  msgArray = [];
  eDependencies = [];
  currentMilestone: MilestoneModel;
  goalId: number;
  dependGoalName: string;
  dependGoalid: number;
  dependMilestoneName: string;
  dependMilestoneNameId: number;
  confirmDeletingModalRef: NgbModalRef;
  modalRef: NgbModalRef;

  constructor(
    private kanbanService: TasksService,
    private accountService: AccountService,
    private projectsService: ProjectsService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private milestonesService: MilestonesService,
    private loaderService: LoaderService,
    private modal: NgbModal
  ) {
    this.project = new ProjectModel();
    this.route.params.subscribe((params) => {
      this.goalId = params['goalId'];
      this.project_id = params['id'];
      this.getMilestones();
      this.projectsService.get(params['id']).subscribe((project) => {
        this.project = project;
      });
    });
    this.route.params.subscribe((params) => {
      this.milestone_id = params['milestoneId'];
    });
    this.goal = new TaskModel();
    this.subtasks = [];
    this.dependencies = [];
    this.currentMilestone = new MilestoneModel();

  }

  ngOnInit() {
    // Preload Data
    this.accountService.getProfile().subscribe(response => {
      this.current_user = response;
    });
    this.route.params.subscribe((params) => {
      this.kanbanService.get(params['goalId'])
        .subscribe((task: TaskModel) => {
          this.goal = task;
          this.eDependencies = task.dependency_task;
          this.fetchProcesses();
        });
    });

  }

  fetchProcesses() {
    const resp_data = [];
    for (const processId of this.goal.subtasks) {
      this.kanbanService.get(processId)
        .subscribe((process: TaskModel) => {
          this.subtasks.push(process);
          this.subtasks.sort(this.compareProcesses);
        });

    }
  }

  backBtnClicked() {
    window.history.back();
  }

  addProcessBtnClicked() {
    const date = this.currentMilestone.date_start > new Date() ? this.currentMilestone.date_start : new Date()
    const process = {
      title: `Process ${this.subtasks.length + 1}`,
      due_date: date,
      parent_task: this.goal.id,
      milestone: this.goal.milestone,
      status: 1
    } as TaskModel;
    this.subtasks.push(process);
  }

  confirmDeleteTask(template) {
    this.kanbanService.getDepend(this.goal.id)
      .subscribe((task:ParentDependancyModel) => {
        if(task.parent_dependent_tasks.length != 0){
          this.dependGoalName = task.parent_dependent_tasks[0].title;
          this.confirmDeletingModalRef = this.modal.open(template, { windowClass:'interviewmodel modal-dialog-centered'});
        }else{
          this.kanbanService.deleteTask(this.goal.id)
          .subscribe(response => {
            this.location.back();
          });
        }
      });
  }

  deleteTask() {
    this.kanbanService.deleteTask(this.goal.id)
      .subscribe(response => {
        this.location.back();
        this.confirmDeletingModalRef.close();
      });
  }

  updateTask() {
    this.goal.dependency_task = this.dependencies;
    let updateTask = this.kanbanService.updateTask(this.goal.id, this.goal);
    for (const subtask of this.subtasks) {
      updateTask = updateTask.flatMap(() => {
        if (subtask.id) {
          return this.kanbanService.updateTask(subtask.id, subtask);
        } else {
          return this.kanbanService.addTask(subtask);
        }
      });
    }
    updateTask.subscribe(() => {
      this.router.navigate(['.'], { relativeTo: this.route.parent });
    },
      (errMsg: any) => {
        console.log(errMsg);
        this.checkForErrors(errMsg);
      });
  }

  compareProcesses(first: TaskModel, second: TaskModel) {
    if (first.due_date < second.due_date) {
      return -1;
    } else {
      return 1;
    }
  }

  addDependencyBtnClicked() {
    let dependency = {
      milestone: null,
      task: null
    };

    this.dependencies.push(dependency);
  }

  getMilestones() {
    this.milestonesService.list(this.project_id).subscribe((resp) => {
      this.milestones = [];
      this.currentMilestone = resp.filter(a => a.id == this.milestone_id)[0];
      resp.forEach(e => {
        this.milestones.push({
          id: e.id, label: e.title, value: e.id
        });
      });
    });
  }

  checkForErrors(errorMsg) {
    this.msgArray = [];
    let newErr = {};
    Object.keys(errorMsg).forEach((err) => {
      const value = errorMsg[err];
      if (value[0].milestone !== undefined) {
        //this.msgArray.push(element.milestone[0]);      
        this.msgArray.push('Milestone cannot be blank');
      } else {
        this.msgArray.push(value);
      }
    });
  }

  deleteDependency(dependencyId: number, index: number): void {
    this.kanbanService.deleteDependency(dependencyId)
      .subscribe(response => {
        this.eDependencies.splice(index, 1);
      });
  }
}
