import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProjectsService } from 'app/projects/projects.service';
import StageState from 'app/questionnaire/StageState';
import { StageStorage } from 'app/questionnaire/StageStorage';


/**
 * Questionnaire page for startup flow.
 *
 * Router parameters:
 *  id - project identifier
 *
 * Router data:
 *  title - page title
 *  subtitle - page description
 *  stage - questionnaire stage (for example 'finances_outline')
 *  next - next page stage
 *  previous - previous page stage
 *
 *  Example:
 *  ...
 *  {
 *   path: 'operation_management',
 *   component: StartupStageComponent,
 *   data: {
 *     title: 'Operations Management',
 *     subtitle: 'Lorem ipsum dolor sit nuis que',
 *     stage: 'operation_management',
 *     next: 'finances_outline'
 *   }
 * }
 */
@Component({
  templateUrl: './stage.component.html',
  styleUrls: [
    './stage.component.scss',
  ],
})
export class StartupStageComponent implements OnInit {
  title: string;
  subtitle: string;
  // project: ProjectModel;
  stage: string;
  previous?: string;
  next?: string;
  stageState: StageState;
  projectId: any;
  loadStage: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private stageStorage: StageStorage,
    private projectsService: ProjectsService,
  ) {
    this.title = route.snapshot.data['title'];
    this.subtitle = route.snapshot.data['subtitle'];
    this.stage = route.snapshot.data['stage'];
    this.previous = route.snapshot.data['previous'];
    this.next = route.snapshot.data['next'];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.stageState = this.stageStorage.getStageState(this.stage, this.projectId);
      this.stageStorage.loadAnswers(this.projectId, 'startup').subscribe((stageState) => {
        if (stageState.stage === this.stage) {
          this.stageState = stageState;
        }
        this.loadStage = true;
      });
      // this.projectsService.get(params['id']).subscribe((project) => {
      //   this.project = project;
      // });
    });
  }

  onToolbarClicked(event: string) {
    const options = {
      relativeTo: this.route.parent,
    };

    if (event === 'next' && this.next) {
      this.router.navigate([this.next], options);
    } else if (event === 'back' && this.previous) {
      this.router.navigate([this.previous], options);
    } else if (event === 'home') {
      this.router.navigate(['/founder/projects', this.projectId, 'summary'], options);
    }
  }

  onDone(success: any) {
    if (this.next) {
      this.onToolbarClicked('next');
    } else {
      this.onToolbarClicked('home');
    }
  }

  onSkip() {
    this.router.navigate(['founder', 'projects', this.projectId, 'summary']);
  }
}
