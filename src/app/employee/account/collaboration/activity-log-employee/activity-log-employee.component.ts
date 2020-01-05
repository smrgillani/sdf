import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ProjectsService } from 'app/projects/projects.service';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';

@Component({
  selector: 'app-activity-log-employee',
  templateUrl: './activity-log-employee.component.html',
  styleUrls: ['./activity-log-employee.component.scss'],
  providers: [PaginationMethods]
})
export class ActivityLogEmployeeComponent implements OnInit {

  projectId: number;
  searchText: '';
  pageSize = 5;
  count: number;
  activityLogList: any;
  isCollapsedArray: boolean[] = [];

  constructor(private projectsService: ProjectsService, private route: ActivatedRoute, private _location: Location) {
    this.projectId = this.route.parent.params["_value"].id ? parseInt(this.route.parent.params["_value"].id) : 0;
  }

  ngOnInit() {
  }

  getUserActivityLogs(newPage) {
    if (newPage) {
      this.projectsService.getUserActivityLogs(newPage, this.pageSize, this.searchText, this.projectId).subscribe((infoList) => {
        this.activityLogList = infoList['results'];
        this.count = infoList['count'];
        this.activityLogList.forEach((item, index) => {
          this.isCollapsedArray[index] = true;
        });
      });
    }
  }

  toggleAccordian(e, x) {
    let lastopen = this.isCollapsedArray[x];
    this.activityLogList.forEach((item, index) => {
      this.isCollapsedArray[index] = true;
    });
    this.isCollapsedArray[x] = !lastopen;

  }
}
