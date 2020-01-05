import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

import { IDEA_STAGES } from '../../idea.constants';
import { ProjectsService } from 'app/projects/projects.service';
import { QuestionnaireService } from 'app/questionnaire/questionnaire.service';
import { StageStorage } from 'app/questionnaire/StageStorage';
import { AuthService } from 'app/auth/auth.service';
import { StageNotifications } from '../stage/StagesNotifications';


@Component({
  // selector: 'app-idea-realization-overview',
  templateUrl: './overview.component.html',
  styleUrls: [
    './overview.component.scss',
  ],
  providers: [StageNotifications],
})
export class RealizationOverviewComponent implements OnInit {
  idea: any;
  stages: any[] = IDEA_STAGES;
  done = false;
  uncompletedStage: string;
  isNew: boolean;
  method: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private stageStorage: StageStorage,
    private auth: AuthService,
    private ideaPopover: StageNotifications,
    private projectsService: ProjectsService,
    private questionnaireService: QuestionnaireService,
  ) {
    this.route.params.subscribe((params) => {
      this.method = params['method'];
    });
  }

  navigateToIfComplete(stage, i, popover) {
    this.ideaPopover.chaeckStageCompletion(stage, i)
      .subscribe(
        (menu) => {
          this.navigateTo(menu);
        },
        (uncompleteStage) => {
          if (popover) {
            popover.open();
          }

          this.uncompletedStage = uncompleteStage;
        },
        () => {},
      );
  }

  ngOnInit() {
    let i, index = 0;

    this.route.params.subscribe((params) => {
      this.idea = params['idea'];
      this.isNew = !(/false/i).test(params['new']);

      if (this.idea) {
        this.stageStorage.loadAnswers(this.idea, 'idea')
          .subscribe((stageState) => {
            this.done = this.isDone();

            if (i === undefined && this.idea && this.stages[index].state.answers && !this.stages[index].state.done) {
              i = index;
              if (!this.isNew) {
                this.navigateToIfComplete(this.stages[index], index, null);
              }
            }

            index += 1;
          });
      } else {
        /* Bug 86 - user should be able to create new idea irrespective of project visiblity status */
        // this.projectsService.list().subscribe((projects: ProjectModel[]) => {
        //   const lastStarted = _.findLast(projects, {is_visible: false});
        //   if (lastStarted) {
        //     this.stageStorage.clearStagesState();
        //     this.router.navigate(['.', {idea: lastStarted.id}], {relativeTo: this.route.parent});
        //   }
        // });
        this.stageStorage.loadStagesState();
      }

      for (const stage of this.stages) {
        stage.state = this.stageStorage.getStageState(stage.url, this.idea);
      }

      this.done = this.isDone();
    });
  }

  isDone(): boolean {
    return _.every(this.stages, (stage) => stage.state.done);
  }

  navigateTo(menu: any) {
    if (menu.enabled) {
      this.router.navigate([menu.url], {relativeTo: this.route});
    }
  }

  nextStage() {
    if (this.done) {
      const states = this.stageStorage.getStagesState();
      const answers = _.reduce(states, (result, value) => {
        return result.concat(value.answers);
      }, []);

      if (this.auth.isTemporaryUser()) {
        this.router.navigate(['founder', 'account', 'edit']);
      } else if (!this.idea) {
        this.questionnaireService.createIdea(answers, true)
          .subscribe((ideaId) => {
            this.stageStorage.clear();
            this.router.navigate(['founder', 'projects', ideaId, 'summary']);
          });
      } else {
        this.router.navigate(['founder', 'projects', this.idea, 'summary']);
      }
    }
  }

  onBack() {
    if (this.method === 'new' || this.isNew) {
      this.router.navigate(['/founder']);
    } else {
      this.router.navigate(['/founder/projects']);
    }
  }
}
