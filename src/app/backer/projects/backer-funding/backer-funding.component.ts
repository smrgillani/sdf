import { Component, OnInit } from '@angular/core';
import { ProjectsService } from 'app/projects/projects.service';
import { Router, ActivatedRoute } from '@angular/router';

import FundTypeModel from 'app/projects/models/FundTypeModel';
import ProjectFundTypeDetailsModel from 'app/projects/models/ProjectFundTypeDetailsModel';
import ProjectBackerFundingModel from 'app/projects/models/ProjectBackerFundingModel';


@Component({
  selector: 'app-backer-funding',
  templateUrl: './backer-funding.component.html',
  styleUrls: ['./backer-funding.component.scss'],
})
export class BackerFundingComponent implements OnInit {
  projectId: number;
  fundTypes: FundTypeModel[];
  project: ProjectFundTypeDetailsModel;
  selectedFundTypesToProceed: { projectId: number, fundType: ProjectBackerFundingModel }[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
  ) {
    this.project = new ProjectFundTypeDetailsModel();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.selectedFundTypesToProceed = this.projectsService.getBackerSelectedFundToProceed(this.projectId);

      this.projectsService.getProjectFundingTypesForBacker(this.projectId).subscribe((projectFundDetails: ProjectFundTypeDetailsModel) => {
        this.project = projectFundDetails;

        this.project.funds.forEach((item) => {
          item.isCollapsed = true;
        });
        this.fundTypes = this.project.funds.filter(f => f.is_active == true);
        this.selectedFundTypesToProceed.forEach((item) => {
          this.fundTypes.find(d => d.id == item.fundType.fund).isSelected = true;
        });
      });
    });
  }

  manageFundTypeSelection(ev: any, fundType: FundTypeModel) {
    if (ev.target.checked) {
        this.projectsService.addBackerSelectedFundToProceed(this.projectId, fundType.id, fundType.title);
    }
    else {
        this.projectsService.removeBackerSelectedFundToProceed(this.projectId, fundType.id);
    }
}

  backToLaunch() {
    this.router.navigate([`/backer/projects/${this.projectId}/launch`]);
  }
}
