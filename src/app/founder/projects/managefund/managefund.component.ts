import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ProjectsService } from "app/projects/projects.service";
import FundTypeModel from "app/projects/models/FundTypeModel";
import ProjectFundingModel from "app/projects/models/ProjectFundingModel";
import ProjectFundTypeDetailsModel from "../../../projects/models/ProjectFundTypeDetailsModel";


@Component({
    templateUrl: './managefund.component.html',
    styleUrls: ['./managefund.component.scss']
})
export class FounderProjectManageFundComponent implements OnInit {
    projectId: number;
    fundTypes: FundTypeModel[];
    project: ProjectFundTypeDetailsModel;
    selectedFundTypesToProceed: { projectId: number, fundType: ProjectFundingModel }[];
    @ViewChild('content') content;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NgbModal,
        private projectsService: ProjectsService
    ) {
        this.project = new ProjectFundTypeDetailsModel();
    }
    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.projectId = params['id'];
            this.selectedFundTypesToProceed = this.projectsService.getSelectedFundToProceed(this.projectId);

            this.projectsService.getProjectFundingTypeDetails(this.projectId).subscribe((projectFundDetails: ProjectFundTypeDetailsModel) => {
                this.project = projectFundDetails;
                console.log('this.project');
                console.log(this.project);

                this.project.funds.forEach((item) => {
                    item.isCollapsed = true;
                });
                this.fundTypes = this.project.funds.filter(f => f.is_active == true);
                if(this.project.is_registered === false){
                    //Only Normal Crowd funding and P2P will be enabled
                    this.fundTypes.filter(f=>f.id!=4 && f.id!=5).forEach((item)=>{
                        item.isNotAllowed = true;
                    });
                }
                this.selectedFundTypesToProceed.forEach((item) => {
                    this.fundTypes.find(d => d.id == item.fundType.fund).isSelected = true;
                });
            });
        });
    }

    backToLaunch() {
        this.router.navigate([`/founder/projects/${this.projectId}/launch`]);
    }

    manageFundTypeSelection(ev: any, fundType: FundTypeModel) {
        if (ev.target.checked) {
            this.projectsService.addSelectedFundToProceed(this.projectId, fundType.id, fundType.title);
        }
        else {
            this.projectsService.removeSelectedFundToProceed(this.projectId, fundType.id);
        }
    }

    notAllowed(ev){
        ev.preventDefault();
        this.modalService.open(this.content);
    }

    editManageFund(item:FundTypeModel){
        let data = this.project.fund_details.filter(f=>f.fund===item.id);
        if(data!==undefined && data.length>0){
            this.router.navigate([`/founder/projects/${this.projectId}/managefund/${data[0].id}/edit`]);
        }
    }

    downloadFundInfo(item:FundTypeModel) {
        let data = this.project.fund_details.filter(f=>f.fund===item.id);
        if(data!==undefined && data.length>0){
            this.projectsService.downloadManageFund(data[0].id).subscribe((obj)=>{

                var link = document.createElement('a');
                link.download = "manage_fund.pdf";
            
                const fileReader = new FileReader();
                var blob = new Blob([obj._body], { type: 'contentType' });
                fileReader.readAsDataURL(blob);
                fileReader.onloadend = (event: ProgressEvent) => {
                    if (event.target['result']) {
                    link.href = event.target['result'];
            
                    link.click();
                    }
                };
        
            }, (errorMsg: any) => {
                console.log(errorMsg);
            });
        }
    }
}