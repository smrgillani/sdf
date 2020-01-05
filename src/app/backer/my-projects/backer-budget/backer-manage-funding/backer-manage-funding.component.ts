import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import * as moment from 'moment';

import ProjectModel from 'app/projects/models/ProjectModel';
import ProjectManageFundsModel from 'app/projects/models/ProjectManageFundsModel';
import { ProjectsService } from 'app/projects/projects.service';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';

@Component({
  selector: 'app-backer-manage-funding',
  templateUrl: './backer-manage-funding.component.html',
  styleUrls: ['./backer-manage-funding.component.scss'],
  providers: [PaginationMethods]
})
export class BackerManageFundingComponent implements OnInit, OnDestroy {

  projectId: number;
  project: ProjectModel;
  fundsList: ProjectManageFundsModel[] = [];
  pageSize: number = 10;
  count: number = 0;
  searchText: string = '';
  timer: any[] = [];

  constructor(private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private _location: Location,
    private modalService: NgbModal,
    private router: Router) { 
      this.project = new ProjectModel();
    }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.loadProject();
    });
  }

  ngOnDestroy() {
    for (let index = 0; index < this.timer.length; index++) {
      clearInterval(this.timer[index]);
    }
  }

  timeBetweenDates(toDate, index) {
    let returnData: string = 'Expired';
    let dateEntered = toDate;
    let now = new Date();
    let difference = dateEntered.getTime() - now.getTime();

    if (difference <= 0) {

      // Timer done
      clearInterval(this.timer[index]);
      return returnData;
    } else {

      let seconds = Math.floor(difference / 1000);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
      let days = Math.floor(hours / 24);

      hours %= 24;
      minutes %= 60;
      seconds %= 60;

      returnData = `Days ${days}, ${hours}:${minutes}:${seconds}`;
      return returnData;
    }
  }

  loadProject() {
    this.projectsService.getForBacker(this.projectId).subscribe((project) => {
      this.project = project;
    });
  }

  getfunds(newPage) {
    if (this.projectId) {
      this.projectsService.getBackerManageFundsList(this.projectId, newPage, this.pageSize, this.searchText).subscribe((data) => {
        this.count = data.count;
        this.fundsList = data.results;
        this.fundsList.forEach((element, index) => {
          if (element.expiry_date) {
            this.timer.push(setInterval(() => {
              element['expiry_date_string'] = this.timeBetweenDates(moment(element.expiry_date).hour(23).minute(59).second(59).toDate(), index);
            }, 1000));
          }
        });
      });
    }
  }

  valueChange() {
    if (this.searchText.length > 2 || this.searchText == '') {
      this.getfunds(1);
    }
  }

}
