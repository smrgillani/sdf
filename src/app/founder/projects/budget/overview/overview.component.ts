import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from 'app/projects/projects.service';
import ProjectModel from 'app/projects/models/ProjectModel';
import { Location } from '@angular/common';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class FounderProjectBudgetOverviewComponent implements OnInit, OnDestroy {
  projectId: number;
  project: ProjectModel;
  timer: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private _location: Location,
  ) {
    this.project = new ProjectModel();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.loadProject();
      this.timer = setInterval(() => {
        this.loadProject();
      }, 10000);
    });
  }
  loadProject() {

    this.projectsService.get(this.projectId).subscribe((project) => {
      this.project = project;
      let expected_funds: number = this.project.expected_funds && this.project.expected_funds != '' ? parseFloat(this.project.expected_funds.replace(/[$,]/g,'')) : 0;
      let receive_funds: number = this.project.receive_funds && this.project.receive_funds != '' ? parseFloat(this.project.receive_funds.replace(/[$,]/g,'')) : 0;
      let expences: number = this.project.expences && this.project.expences != '' ? parseFloat(this.project.expences.replace(/[$,]/g,'')) : 0;
      this.project.my_fund_percent = (expected_funds != 0 && receive_funds != 0) ? (receive_funds / expected_funds) * 100 : 0;
      this.project.my_expences_percent = (receive_funds != 0 && expences != 0) ? (expences / receive_funds) * 100 : 0;
    });
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

}
