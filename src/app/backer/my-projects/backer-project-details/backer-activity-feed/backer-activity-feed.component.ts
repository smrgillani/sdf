import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

import { ProjectsService } from 'app/projects/projects.service';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-backer-activity-feed',
  templateUrl: './backer-activity-feed.component.html',
  styleUrls: ['./backer-activity-feed.component.scss'],
  providers: [PaginationMethods]
})
export class BackerActivityFeedComponent implements OnInit {

  count: number;
  pageSize = 5;
  activityFeedList: any;
  projectId: number;

  constructor(private _location: Location,
    private projectsService: ProjectsService,
    private paginationMethods: PaginationMethods,
    private route: ActivatedRoute) { this.activityFeedList = []; }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
    });
  }

  getActivityFeed(newPage) {
    if (newPage) {
      this.projectsService.activeFeedlistForBacker(newPage, this.pageSize, this.projectId)
        .subscribe((activityFeedList: any[]) => {
          this.activityFeedList = activityFeedList['results'];
          this.count = activityFeedList['count'];
        });
    }
  }

}
