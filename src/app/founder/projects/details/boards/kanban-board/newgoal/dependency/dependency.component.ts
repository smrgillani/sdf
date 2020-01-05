import { Component, OnInit, Input } from '@angular/core';
import {MilestonesService} from 'app/projects/milestones.service';
import TaskModel from '../../../../../../../core/models/TaskModel';

@Component({
  selector: 'app-dependency',
  templateUrl: './dependency.component.html',
  styleUrls: ['./dependency.component.css']
})
export class DependencyComponent implements OnInit {
  @Input() dependencies: any;
  @Input() dependency: any;
  @Input() milestones: any[];
  @Input() goals: any[];
  milestone: String;
  goal: String;
  @Input() projectId: number;
  @Input() dIndex: number;
  internalMilestones: any[];
  @Input() currentgoal: TaskModel;
  milestoneWithGoals: any[];

  constructor(
    private milestonesService: MilestonesService
  ) { 
    this.internalMilestones = []; 
  }

  ngOnInit() {
    if(this.currentgoal){
      this.milestonesService.getGoalMileStoneList(this.currentgoal.id).subscribe((obj)=>{
        this.milestoneWithGoals = [];
        this.milestoneWithGoals = obj;
        this.milestones = [];
        obj.forEach(e=>{
          this.milestones.push({
            id: e.id, label: e.title, value: e.id          
          });
        }); 
      });
    }
  }

  onMilestoneSelect(milestoneId) {
    this.dependency.task = null;
    if(!this.milestoneWithGoals){
      this.getGoals(milestoneId);
    }
    else{
      this.getGoalsOnEdit(milestoneId);
    }
  }

  getGoals(milestoneId) {
    this.milestonesService.getMilestone(this.projectId, milestoneId).subscribe( (resp) => {
        this.goals = [];   
        if (resp.tasks.length > 0) {
          for (let task of resp.tasks) {
            this.goals.push({
              id: task.id, label: task.title, value: task.id
            });
          }
        }

        // resp.forEach(e=>{
        //   this.milestones.push({
        //     id: e.id, label: e.title, value: e.id          
        //   });
        // });      
    });
  }
  
  getGoalsOnEdit(milestoneId) {
    this.milestonesService.getMilestone(this.projectId, milestoneId).subscribe( (resp) => {
      this.goals = [];   
      if (resp.tasks.length > 0) {
        for (let task of resp.tasks) {
          if(task.id != this.currentgoal.id)
          this.goals.push({
            id: task.id, label: task.title, value: task.id
          });
        }
      } 
  });
  }

  removeDependency(index: number): void {
    this.dependencies.splice(index, 1);
  }
}
