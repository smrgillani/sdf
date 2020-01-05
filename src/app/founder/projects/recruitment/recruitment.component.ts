import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from 'app/projects/projects.service';
import ProjectModel from 'app/projects/models/ProjectModel';

@Component({
  selector: 'app-recruitment',
  templateUrl: './recruitment.component.html',
  styleUrls: ['./recruitment.component.scss'],
})
export class FounderProjectRecruitmentComponent implements OnInit {
  rateFor = 'employee';
  isMobileOpen = false;
  private projectId: number;
  private project = new ProjectModel();

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.loadProject();
    });
  }

  private loadProject() {
    this.projectsService.get(this.projectId).subscribe((project) => {
      this.project = project;
    });
  }

  tabChanged() {
    setTimeout(() => {
      this.isMobileOpen = false;
    }, 0);
  }

  tabClicked(event: MouseEvent) {
    const target = event.target as any;

    if (target.className.indexOf('nav-link') >= 0) {
      this.isMobileOpen = !this.isMobileOpen;
    }
  }
}
