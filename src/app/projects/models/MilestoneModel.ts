import TaskModel from 'app/core/models/TaskModel';


export default class MilestoneModel {
  id?: number;
  title: string;
  description: string;
  date_start: Date;
  date_end: Date;
  project: number;
  tasks?: TaskModel[];
  is_milestone_in_startup_stage: boolean;
  progress: number;
  icon_category: string;
  icon_name: string;
  order: number;
  place_it_after: any;
  isPlaceAfterChanged: boolean;
}
