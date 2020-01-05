import { DocumentExplorerItem } from 'app/elements/document-explorer/DocumentExplorerItem';
import MilestoneModel from 'app/projects/models/MilestoneModel';


export class MilestoneItem extends DocumentExplorerItem {
  protected milestone: MilestoneModel;

  get title() {
    return this.milestone.title;
  }

  get isFolder() {
    return true;
  }

  get resource(): { id } {
    return this.milestone as { id };
  }

  constructor(milestone: MilestoneModel) {
    super();
    this.milestone = milestone;
  }

  hash() {
    return `milestone:${this.milestone.id}`;
  }
}
