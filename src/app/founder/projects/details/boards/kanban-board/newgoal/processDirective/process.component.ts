import {Component, Input, OnInit, ViewEncapsulation, EventEmitter, Output, ElementRef, ViewChild} from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import {trigger, state, style, animate, transition, keyframes} from '@angular/animations';
import * as moment from 'moment';
import TaskModel from 'app/core/models/TaskModel';
import {AccountService} from 'app/founder/account/account.service';
import {TasksService} from 'app/projects/tasks.service';
import MilestoneModel from '../../../../../../../projects/models/MilestoneModel';
/**
 * Component for editing goal subtasks.
 * Includes subtask inline name editing and managing subtask rules.
 *
 * @input subtask: subtask (process) instance
 *
 * Usage:
 *  <app-process [subtask]="subtask"></app-process>
 */
@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: [
    './process.component.scss'

  ],
  providers: [AccountService, TasksService]
})
export class ProcessComponent implements OnInit {

  @Input() subtask: TaskModel;
  @Input() currentMilestone: MilestoneModel;
  @Input() pIndex: number;
  @Input() subtasks: any;
  processId: string;
  processName: string;
  users: any;
  isCollapsed = false;
  searchInputActive = false;
  hideCalendar: boolean;
  eProceses= [];

  constructor(
    private accountService: AccountService,
    private kanbanService: TasksService,
  ) {}

  ngOnInit() {};


  toggleCalendar(toggleCalendar) {
    this.hideCalendar = toggleCalendar;
  }

  arrowBtnClicked(process_name: string) {
    this.isCollapsed = !this.isCollapsed;
  }

  addRuleBtnClicked() {
    this.subtask.rules = this.subtask.rules || [];
    this.subtask.rules.push({
      title: 'Rule ' + (this.subtask.rules.length + 1)
    });
  }
  deleteProcess(processId: number, index: number, subtasks: any){
    this.eProceses = subtasks;
    this.kanbanService.deleteTask(processId)
      .subscribe(response => {
        this.eProceses.splice(index, 1);
      });
  }
  showChange() {

  }
}
