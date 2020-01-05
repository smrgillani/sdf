import MilestoneModel from 'app/projects/models/MilestoneModel';
import { Work } from 'app/elements/gantt-chart/interfaces';


/**
 * Adapter for MilestoneModel to use it as Work object on the Gantt chart.
 */
export class MilestoneWorkAdapter implements Work {
  milestone: MilestoneModel;

  constructor(milestone: MilestoneModel) {
    this.milestone = milestone;
  }

  get title(): string {
    return this.milestone.title;
  }

  get progress() {
    return this.milestone.progress ? this.milestone.progress : 0;
  }

  get is_milestone_in_startup_stage(): boolean {
    return this.milestone.is_milestone_in_startup_stage;
  }

  get startDate(): Date {
    return this.milestone.date_start;
  }

  set startDate(date: Date) {
    this.milestone.date_start = date;
  }

  get endDate(): Date {
    return this.milestone.date_end;
  }

  set endDate(date: Date) {
    this.milestone.date_end = date;
  }
}
