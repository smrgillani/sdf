import LaunchModel from "app/projects/models/LaunchModel";

export default class ProjectLaunchDetailsModel {
    id: number;
    title: string;
    is_registered:boolean;
    launch:LaunchModel[];
    manage_fund:boolean;
  }