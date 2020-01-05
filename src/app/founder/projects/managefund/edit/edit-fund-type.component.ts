import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectsService } from "app/projects/projects.service";
import ProjectFundingModel from "app/projects/models/ProjectFundingModel";
import FundTypes from "app/projects/fundtypes.enum";
import * as moment from 'moment';
import { Location } from '@angular/common';

@Component({
    templateUrl:'./edit-fund-type.component.html',
    styleUrls: ['../funding-type/funding-type.component.scss']
})
export class FounderProjectEditFundingTypeComponent implements OnInit {
    projectId:number;
    fundId:number;
    fundDetails:ProjectFundingModel;
    fundTypes = FundTypes;
    serverSideErrors:any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private projectsService: ProjectsService,
        private location: Location
    ){
        this.fundDetails = new ProjectFundingModel();
    }
    ngOnInit(){
        this.route.params.subscribe((params) => {
            this.projectId = params['id'];
            this.fundId = params['fundid'];

            this.projectsService.getProjectFundingDetails(this.fundId).subscribe((fundDetails: ProjectFundingModel) => {
                if(fundDetails.due_by!=null){
                    fundDetails.due_by = moment(fundDetails.due_by, 'YYYY-MM-DD').toDate();
                }
                this.fundDetails = fundDetails;
                console.log('this.fundDetails');
                console.log(this.fundDetails);
            });
        });
    }

    goBack() {
        this.router.navigate([`/founder/projects/${this.projectId}/managefund`]);
    }

    SaveFundData() {
        console.log(this.fundDetails);
        this.projectsService.saveProjectFundData(this.fundDetails)
        .subscribe(
            () => {
                console.log('SaveFundData success!');
                // this.router.navigate([`/founder/projects/${this.projectId}/managefund`]);
                this.location.back();
            },
            (errMsg: any) => {
                console.log('SaveFundData error', errMsg);
                if (Array.isArray(errMsg)){
                    this.serverSideErrors = errMsg;
                    setTimeout(()=>{this.serverSideErrors = null},5000);
                }
            }
        );
    }

    isArray(errors){
        return Array.isArray(errors);
    }
}