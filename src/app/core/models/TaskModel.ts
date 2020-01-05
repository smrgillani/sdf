import ParentDependancyModel from 'app/core/models/ParentDependancyModel';

export default class TaskModel {
  id?: number;
  milestone: number;
  project: number;
  title: string;
  description: string;
  goal_description: string;
  status: number;
  assignee: number;
  participants: number[];
  due_date: Date;
  tags?: any[];
  complete_percent: number;
  parent_task: number;
  subtasks: any[];
  rules: any[];
  order: number;
  documents?: any[];
  dependency_task: any[];
  parent_dependent_tasks: ParentDependancyModel[];
  is_complete: boolean;
  is_creator: boolean;
  process_percentage: number;
  is_reassign: boolean;
  owner: number;
  uploaded_document?: any;
  color: any;
}
