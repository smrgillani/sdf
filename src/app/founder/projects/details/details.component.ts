import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';

import ProjectActivityModel from 'app/projects/models/ProjectActivityModel';
import {ProjectsService} from 'app/projects/projects.service';


@Component({
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss',
  ]
})
export class FounderProjectDetailsComponent implements OnInit {
  @ViewChild(NgbPopover) popover: NgbPopover;

  project: ProjectActivityModel;
  buttons: any[];
  notImplementedMessage: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService
  ) {
    this.project = new ProjectActivityModel();
    this.notImplementedMessage = 'This features are not yet implemented';
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      localStorage.setItem('project_id', params['id'].toString());
      this.projectsService.getActivity(params['id'])
        .subscribe((project: ProjectActivityModel) => {
          this.project = project;
          localStorage.setItem('project_name', project.title);
        });
    });

    this.buttons = [
      {caption: 'Operations', color: '#00D8C9', icon: 'operations.svg', link: 'operations'},
      {caption: 'Workflow', color: '#FE5F5B', icon: 'workflow.svg', link: 'processesdue-soon'},
      {caption: 'Tasks', color: '#679BF9', icon: 'tasks.svg', link: 'task'},
      {caption: 'Budget', color: '#FF6C24', icon: 'budget.png', link: 'budget'},
      {caption: 'Recruitment', color: '#00D8C9', icon: 'recruitment.svg',link: 'recruitment'},
      {caption: 'Messages', color: '#679BF9', icon: 'messages.svg', link: 'collaboration'},
      {caption: 'Services', color: '#FE5F5B', icon: 'services.svg', link: 'services'}
    ];
  }

  getIcon(icon: string): string {
    return `/assets/img/project/${icon}`;
  }

  goTo(link?: string) {
    if (link) {
      this.router.navigate([link], {relativeTo: this.route});
    }
  }
}
