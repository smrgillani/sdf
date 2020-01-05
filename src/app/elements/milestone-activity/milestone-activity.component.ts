import { OnInit, Input, Component } from "@angular/core";
import MilestoneModel from "app/projects/models/MilestoneModel";
import { MilestonesService } from "app/projects/milestones.service";
import { ActivatedRoute } from "@angular/router";
import { PaginationMethods } from "app/elements/pagination/paginationMethods";

@Component({
    selector:'app-milestone-activity',
    templateUrl:'./milestone-activity.component.html',
    styleUrls:['./milestone-activity.component.scss'],
    providers: [PaginationMethods]
})
export class MilestoneActivityComponent implements OnInit{
    @Input() milestone: MilestoneModel;
    projectId: number;
    activityFeedList:any;
    count: number;
    pageSize = 5;

    constructor(
        private route: ActivatedRoute,
        private milestonesService: MilestonesService){
        
    }
    
    ngOnInit(){
        this.route.params.subscribe((params) => {
            this.projectId = params['id'];
            this.getActivityLog(1);
          });
    }

    getActivityLog(newPage){
        this.milestonesService.getMilestoneActivity(this.projectId,this.milestone.id,newPage, this.pageSize)
        .subscribe((activity)=>{
            this.count = activity.count;
            this.activityFeedList = activity.results;
        });
    }
}