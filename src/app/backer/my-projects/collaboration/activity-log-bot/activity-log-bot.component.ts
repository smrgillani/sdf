import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { ProjectsService } from 'app/projects/projects.service';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';

@Component({
  selector: 'app-activity-log-bot',
  templateUrl: './activity-log-bot.component.html',
  styleUrls: ['./activity-log-bot.component.scss'],
  providers: [PaginationMethods]
})
export class ActivityLogBotComponent implements OnInit {

  projectId: number;
  searchText: '';
  pageSize = 5;
  count: number;
  userList: any;

  constructor(private projectsService: ProjectsService, private route: ActivatedRoute,
    private router: Router, private _location: Location) {
    this.projectId = this.route.parent.params["_value"].id ? parseInt(this.route.parent.params["_value"].id) : 0;
  }

  ngOnInit() {
    //this.getAllProjectUsers(1);  
  }

  getAllProjectUsers(newPage) {
    if (newPage) {
      this.projectsService.getAllProjectUsers(newPage, this.pageSize, this.searchText, this.projectId).subscribe((infoList) => {
        this.userList = infoList['results'];
        this.count = infoList['count'];
      });
    }
  }

  selectedUser(id) {
    this.router.navigate([{
      outlets: { documents: ['activity-log', id] }
    }], { relativeTo: this.route.parent });
  }

}
