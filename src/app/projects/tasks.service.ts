import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as _ from 'lodash';
import * as moment from 'moment';

import TaskModel from 'app/core/models/TaskModel';
import {ApiService} from 'app/core/api/api.service';


@Injectable()
export class TasksService {

  constructor(private api: ApiService) {
  }

  list(): Observable<TaskModel[]> {

    return this.api.get<TaskModel[]>('idea/tasks')
      .map((tasks: TaskModel[]) => {
        for (const task of tasks) {
          task.due_date = moment(task.due_date).toDate();
        }
        return tasks;
      });
  }

  listByMilestone(milestoneId): Observable<TaskModel[]> {
    return this.api.get<TaskModel[]>(`milestones/${milestoneId}/tasks`)
      .map((tasks: TaskModel[]) => {
        for (const task of tasks) {
          task.due_date = moment(task.due_date).toDate();
        }
        return tasks;
      });
  }

  get(id): Observable<TaskModel> {
    return this.api.get<TaskModel>('idea/get-dependent/' + id)
      .map((task: TaskModel) => {
        task.due_date = moment(task.due_date).toDate();
        return task;
      });
  }

  getDepend(id): Observable<TaskModel> {
    return this.api.get<TaskModel>('idea/tasks/' + id)
      .map((task: TaskModel) => {
        return task;
      });
  }

  addTask(task: any) {
    // XXX: due_date should be changes to the date-time format on the backend.
    const patchedTask: any = _.cloneDeep(task);
    patchedTask.due_date = moment(task.due_date).format('YYYY-MM-DD');
    //const data: any = _.cloneDeep(patchedTask);
    return this.api.post<any, any>('idea/tasks', patchedTask);
  }

  updateTask(task_id: number, task: TaskModel) {
    // XXX: due_date should be changes to the date-time format on the backend.
    const patchedTask: any = _.cloneDeep(task);
    patchedTask.due_date = moment(task.due_date).format('YYYY-MM-DD');
    return this.api.put('idea/tasks/' + task_id, patchedTask);
  }

  deleteTask(task_id: number) {
    return this.api.delete('idea/tasks/' + task_id)
      .map((response: any) => {
        return response;
      });
  }

  getStatuses() {
    return this.api.get('idea/tasks/statuses');
  }

  deleteDependency(dependencyId: number) {
    return this.api.delete('idea/tasks/dependent-tasks/' + dependencyId)
      .map((response: any) => {
        return response;
      });
  }

  getActiveWorkSession(id): Observable<any> {
    return this.api.get(`idea/get-dependent/${id}`);
  }

  startActiveWorkSession(id): Observable<any> {
    return this.api.post(`work/session`,{task:id});
  }

  stopActiveWorkSession(id,hours:string): Observable<any> {
    console.log(`session id = ${id}, hours = ${hours}`);
    return this.api.put(`work/session/${id}`,{loggedin_hours:hours});
  }

  checkExtensionRequest(id): Observable<any> {
    return this.api.get(`idea/tasks/${id}/extension-request-exists`);
  }

  postExtensionHour(data): Observable<any> {
    return this.api.post(`task-extension-request`, data);
  }

  getExtensionHour(id): Observable<any> {
    return this.api.get(`task-extension-request/${id}/details`);
  }

  putExtensionHour(id, status: string): Observable<any> {
    const data = {status: status};
    return this.api.put(`task-extension-request/${id}`, data);
  }

  reassignTask(data: any): Observable<any> {
    return this.api.post(`idea/reassign-task`, data);
  }

}
