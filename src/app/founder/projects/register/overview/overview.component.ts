import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { REGISTER_STAGES } from '../register.constants';
import { ProjectsService } from 'app/projects/projects.service';
import { AuthService } from 'app/auth/auth.service';
import ProjectModel from 'app/projects/models/ProjectModel';
import { RegistrationStageStorage } from 'app/founder/projects/register/questionnaire/RegistrationStageStorage';
import { RegistrationStageNotifications } from 'app/founder/projects/register/stage/StagesNotifications';
import { ProjectRegisterService } from 'app/projects/register.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  providers: [RegistrationStageNotifications],
})
export class ProjectRegisterOverviewComponent implements OnInit {
  stages: any[] = REGISTER_STAGES;
  projectId: number;
  done = false;
  uncompletedStage: string;
  entityType: {
    id: number,
    title: string,
    amount: number,
    description: string
  } = {id: null, title: '', amount: null, description: ''};

  constructor(
    private projectsService: ProjectsService,
    private registerService: ProjectRegisterService,
    private auth: AuthService,
    private stageStorage: RegistrationStageStorage,
    private registerPopover: RegistrationStageNotifications,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];

      this.projectsService.get(this.projectId).subscribe((project: ProjectModel) => {
        if (project.registration_type) {
          this.registerService.getEntity(project.registration_type).subscribe((ent: any) => {
            this.entityType = ent;
          });
          this.stageStorage.loadAnswers(project.id, project.registration_type)
            .subscribe((stageState) => {
              this.done = this.isDone();
            });
        } else {
          // if entity type not selected then redirect to entity page.
          this.router.navigate(['.'], {relativeTo: this.route});
        }
      });

      for (const stage of this.stages) {
        stage.state = this.stageStorage.getStageState(stage.url, this.projectId);
      }
      this.done = this.isDone();
    });
  }

  navigateToIfComplete(stage, i, popover) {
    this.registerPopover.checkStageCompletion(stage, i)
      .subscribe(
        (menu) => {
          this.navigateTo(menu);
        },
        (uncompleteStage) => {
          popover.open();
          this.uncompletedStage = uncompleteStage;
        },
        () => {},
      );
  }

  nextStage() {
    if (this.done) {
      const states = this.stageStorage.getStagesState();
      const answers = _.reduce(states, (result, value) => {
        return result.concat(value.answers);
      }, []);

      if (this.auth.isTemporaryUser()) {
        this.router.navigate(['founder', 'account', 'edit']);
      } else {
        // Redirect to last page of registration - probably kind of summary page
        // this.router.navigate(['founder', 'projects', this.idea, 'summary']);
      }
    }
  }

  private isDone(): boolean {
    return _.every(this.stages, (stage) => stage.state.done);
  }

  private navigateTo(menu: any) {
    if (menu.enabled) {
      this.router.navigate([menu.url], {relativeTo: this.route});
    }
  }
}
