import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {Location} from '@angular/common';
import {ProjectsService} from 'app/projects/projects.service';
import {PaginationMethods} from 'app/elements/pagination/paginationMethods';

@Component({
  selector: 'app-activity-feed',
  templateUrl: './activity-feed.component.html',
  styleUrls: ['./activity-feed.component.scss'],
  providers: [PaginationMethods]
})
export class ActivityFeedComponent implements OnInit {
  
  count: number;
  pageSize = 5;
  activityFeedList: any;
  projectId: number;

  constructor(private _location: Location,
    private projectsService: ProjectsService,
    private paginationMethods: PaginationMethods,
    private route: ActivatedRoute,
    private router: Router) { this.activityFeedList = []; }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
    });
  }

  getActivityFeed(newPage) {
    if (newPage) {
      this.projectsService.activeFeedlist(newPage, this.pageSize, this.projectId)
        .subscribe((activityFeedList: any[]) => {
          this.activityFeedList = activityFeedList['results'];
          this.count = activityFeedList['count'];
        });
    }
  }

}
