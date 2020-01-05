import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPopover, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import ProjectActivityModel from 'app/projects/models/ProjectActivityModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from 'app/projects/projects.service';

@Component({
  selector: 'app-backer-project-details',
  templateUrl: './backer-project-details.component.html',
  styleUrls: ['./backer-project-details.component.scss']
})
export class BackerProjectDetailsComponent implements OnInit {

  @ViewChild(NgbPopover) popover: NgbPopover;
  @ViewChild('notification') notification: any;
  popUpForShowInterestModalRef: NgbModalRef;

  project: ProjectActivityModel;
  buttons: any[];
  notImplementedMessage: string;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private modalService: NgbModal
  ) {
    this.project = new ProjectActivityModel();
    this.notImplementedMessage = 'This features is restricted for you';
  }

  ngOnInit() {

    this.route.params.subscribe((params) => {
      localStorage.setItem('project_id', params['id'].toString());
      this.projectsService.getActivityForBacker(params['id'])
        .subscribe((project: ProjectActivityModel) => {
          this.project = project;
          // this.getUserAccess(project.id);
          localStorage.setItem('project_name', project.title);
        });
    });

    this.buttons = [
      { caption: 'Operations', color: '#00D8C9', icon: 'operations.svg', disabled: true, link: 'operations' },
      { caption: 'Workflow', color: '#FE5F5B', icon: 'workflow.svg', disabled: false, link: 'processesdue-soon' },
      {caption: 'Budget', color: '#FF6C24', icon: 'budget.png', disabled: true, link: 'budget'},
      { caption: 'Recruitment', color: '#00D8C9', icon: 'recruitment.svg', disabled: false, link: 'recruitment' },
      { caption: 'Messages', color: '#679BF9', icon: 'messages.svg', disabled: true, link: 'collaboration' },
      {caption: 'Services', color: '#FE5F5B', icon: 'services.svg', link: 'services'}
    ];
  }

  getIcon(icon: string): string {
    return `/assets/img/project/${icon}`;
  }

  goTo(link?: string, isDisabled?: boolean) {

    if (link == 'collaboration' || link == 'operations' || link == 'budget') {
      this.projectsService.getAcessForBacker(parseInt(localStorage.getItem('project_id')))
        .subscribe((info) => {
          if ((link == 'collaboration' && info.chat_access) || (link == 'operations' && info.operation_access) || (link == 'budget' && info.budget_access)) {
            let index = this.buttons.findIndex(a => a.link == link);
            this.buttons[index].disabled = isDisabled = false;
            this.router.navigate([link], { relativeTo: this.route });
          }
          else {
            let index = this.buttons.findIndex(a => a.link == link);
            this.buttons[index].disabled = isDisabled = true;
            this.popUpForShowInterestModalRef = this.modalService.open(this.notification, { backdrop: false });
          }
        });
    }
    else {
      if (link && !isDisabled) {
        this.router.navigate([link], { relativeTo: this.route });
      }
    }
  }

  getUserAccess(id) {
    this.buttons.forEach(element => {
      element.disabled = false;
    });
    /*this.projectsService.getAcessForBacker(id)
      .subscribe((accessInfo) => {
        this.buttons.forEach(element => {
          if ((element.caption == 'Messages' && !accessInfo.chat_access) || (element.caption == 'Operations' && !accessInfo.operation_access)) {
            element.disabled = true;
            this.notImplementedMessage = 'This features is restricted for you';
          }
          else {
            element.disabled = false;
          }
        });
      });*/
  }
}
