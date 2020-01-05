import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import ProjectBudgetModel from 'app/projects/models/ProjectBudgetModel';
import ProjectProductModel from 'app/projects/models/ProjectProductModel';
import { ProjectsService } from 'app/projects/projects.service';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import ProjectModel from 'app/projects/models/ProjectModel';

@Component({
  selector: 'app-backer-material-cost',
  templateUrl: './backer-material-cost.component.html',
  styleUrls: ['./backer-material-cost.component.scss'],
  providers: [PaginationMethods]
})
export class BackerMaterialCostComponent implements OnInit {

  projectId: number;
  projectBudget: ProjectBudgetModel;
  products: ProjectProductModel[];
  count: number;
  pageSize = 5;
  searchText: '';  
  project: ProjectModel;
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private _location: Location) { 
      this.projectBudget = new ProjectBudgetModel();
      this.products = [];
      this.project = new ProjectModel();
    }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.loadProject();
    });
  }

  loadProject() {
    this.projectsService.getForBacker(this.projectId).subscribe((project) => {
      this.project = project;
      let expected_funds: number = this.project.expected_funds && this.project.expected_funds != '' ? parseFloat(this.project.expected_funds.replace(/[$,]/g,'')) : 0;
      let receive_funds: number = this.project.receive_funds && this.project.receive_funds != '' ? parseFloat(this.project.receive_funds.replace(/[$,]/g,'')) : 0;
      let expences: number = this.project.expences && this.project.expences != '' ? parseFloat(this.project.expences.replace(/[$,]/g,'')) : 0;
      this.project.my_fund_percent = (expected_funds != 0 && receive_funds != 0) ? (receive_funds / expected_funds) * 100 : 0;
      this.project.my_expences_percent = (receive_funds != 0 && expences != 0) ? (expences / receive_funds) * 100 : 0;
    });
  }

  getMatrialCost(newPage) {
    if (newPage) {
      this.projectsService.productListForBacker(this.projectId, newPage, this.pageSize, this.searchText)
        .subscribe((data) => {
          this.projectBudget = data;
          if (data.project_product_budget) {
            this.products = data.project_product_budget.results;
            this.count = data.project_product_budget.count;
            //this.currentPage = newPage;
          }
          else {
            this.products = null;
          }
        });
    }
  }

}
