import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { ProjectsService } from 'app/projects/projects.service';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';

@Component({
  selector: 'app-activity-log-user',
  templateUrl: './activity-log-user.component.html',
  styleUrls: ['./activity-log-user.component.scss'],
  providers: [PaginationMethods]
})
export class ActivityLogUserComponent implements OnInit {

  projectId: number;
  searchText: '';
  pageSize = 5;
  count: number;
  activityLogList: any;
  isCollapsedArray: boolean[] = [];
  user: number;

  constructor(private projectsService: ProjectsService, private route: ActivatedRoute,
    private router: Router, private _location: Location) { 
    this.projectId = this.route.parent.params["_value"].id ? parseInt(this.route.parent.params["_value"].id) : 0;
    this.user = this.route.snapshot.params['empId'];
  }

  ngOnInit() {
  }

  getUserActivityLogs(newPage) {
    if (newPage) {
      this.projectsService.getActivityLogBasedOnUserId(newPage, this.pageSize, this.searchText, this.projectId, this.user).subscribe((infoList) => {
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
