import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {ProjectsService} from 'app/projects/projects.service';
import ProjectModel from 'app/projects/models/ProjectModel';
import {Location} from '@angular/common';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';


@Component({
  selector: 'app-my-funds',
  templateUrl: './my-funds.component.html',
  styleUrls: ['./my-funds.component.scss'],
  providers: [PaginationMethods]
})
export class MyFundsComponent implements OnInit {
  projectId: number;
  project: ProjectModel;
  count: number;
  pageSize = 5;
  searchText: '';
  constructor(private route: ActivatedRoute,
  private router: Router,
  private projectsService: ProjectsService,
  private _location: Location,
  private paginationMethods: PaginationMethods) { this.project = new ProjectModel();}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.loadProject();
    });
  }
  loadProject() {
    this.projectsService.get(this.projectId).subscribe((project) => {
      this.project = project;
    });
  }
  valueChange() {
    if (this.searchText.length > 2 || this.searchText == '') {
     // this.getMyEmpoloyeeList(1);
    }
  }
 
}
