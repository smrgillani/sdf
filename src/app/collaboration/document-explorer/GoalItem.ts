import TaskModel from 'app/core/models/TaskModel';
import { DocumentExplorerItem } from 'app/elements/document-explorer/DocumentExplorerItem';


export class GoalItem extends DocumentExplorerItem {
  protected goal: TaskModel;

  get title() {
    return this.goal.title;
  }

  get isFolder() {
    return true;
  }

  get resource(): { id } {
    return this.goal as { id };
  }

  constructor(goal: TaskModel) {
    super();
    this.goal = goal;
  }

  hash() {
    return `goal:${this.goal.id}`;
  }
}
