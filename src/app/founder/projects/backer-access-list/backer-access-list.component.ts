import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ProjectsService } from 'app/projects/projects.service';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';

@Component({
  selector: 'app-backer-access-list',
  templateUrl: './backer-access-list.component.html',
  styleUrls: ['./backer-access-list.component.scss'],
  providers: [PaginationMethods],
})
export class BackerAccessListComponent implements OnInit {
  projectId: number;
  count: number;
  pageSize = 5;
  list: any;
  private searchText = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private projectsService: ProjectsService,
  ) {
    this.projectId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit() {
  }

  getBackerAccessList(newPage) {
    if (newPage) {
      this.projectsService.getBackerAccessList(newPage, this.pageSize, this.searchText, this.projectId)
        .subscribe((listInfo: any) => {
          this.list = listInfo['results'];
          this.count = listInfo['count'];
        });
    }
  }

  isChatOrWorkAccess(event, item) {
    this.projectsService.putBackerAccess(item.id, item.chat_access, item.operation_access, item.budget_access)
      .subscribe((info) => {
        console.log(info);
        this.getBackerAccessList(1);
      });
  }

  navigateToRate(item) {
    this.router.navigate(['./founder', item.user, item.id, 'backer']);
  }
}
