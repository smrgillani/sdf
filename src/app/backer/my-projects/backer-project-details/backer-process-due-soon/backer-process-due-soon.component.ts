import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';

import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { ProjectsService } from 'app/projects/projects.service';

@Component({
  selector: 'app-backer-process-due-soon',
  templateUrl: './backer-process-due-soon.component.html',
  styleUrls: ['./backer-process-due-soon.component.scss'],
  providers: [PaginationMethods]
})
export class BackerProcessDueSoonComponent implements OnInit {

  count: number;
  pageSize = 5;
  processDueSoonList: any;
  projectId: number;

  constructor(private _location: Location,
    private projectsService: ProjectsService,
    private paginationMethods: PaginationMethods,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
    });
  }

  getProcessesDueSoon(newPage) {
    if (newPage) {
      this.projectsService.processDueSoonListForBacker(newPage, this.pageSize,this.projectId)
        .subscribe((processDueSoons: any[]) => {
          this.processDueSoonList = processDueSoons['results'];
          this.count = processDueSoons['count'];
        });
    }
  }

  goToProcess(id: number) {
    this.router.navigate([`../collaboration`, {outlets: {
      documents: ['process', id],
      chat: ['chat', id]
    }}], {relativeTo: this.route});
  }

}
