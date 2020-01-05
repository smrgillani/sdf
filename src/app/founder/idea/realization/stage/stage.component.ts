import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from 'app/auth/auth.service';
import { ProjectsService } from 'app/projects/projects.service';
import { QuestionnaireService } from 'app/questionnaire/questionnaire.service';
import StageState from 'app/questionnaire/StageState';
import { StageStorage } from 'app/questionnaire/StageStorage';
import Question from 'app/questionnaire/models/Question';
import { Location } from '@angular/common';


@Component({
  templateUrl: './stage.component.html',
  styleUrls: [
    './stage.component.scss',
  ],
})
export class StageComponent implements OnInit {
  title: string;
  subtitle: string;
  idea: any;
  stage: string;
  previous?: string;
  next?: string;
  stageState: StageState;
  loadStage: boolean = false;
  isNew: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private stageStorage: StageStorage,
    private authService: AuthService,
    private projectsService: ProjectsService,
    private questionnaireService: QuestionnaireService,
    private location: Location,
  ) {
    this.title = route.snapshot.data['title'];
    this.subtitle = route.snapshot.data['subtitle'];
    this.stage = route.snapshot.data['stage'];
    this.previous = route.snapshot.data['previous'];
    this.next = route.snapshot.data['next'];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.idea = params['idea'];
      this.isNew = !(/false/i).test(params['new']);
      this.loadState();
    });
  }

  loadState() {
    this.stageState = this.stageStorage.getStageState(this.stage, this.idea);
    if (this.idea) {
      this.stageStorage.loadAnswers(this.idea, 'idea').subscribe((stageState) => {
        if (stageState.stage === this.stage) {
          this.stageState = stageState;
        }
        this.loadStage = true;
      });
    } else {
      this.stageStorage.loadStagesState();
      this.loadStage = true;
    }
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
      if (this.idea) {
        this.router.navigate(['.', {method: 'done', idea: this.idea}], options);
      } else {
        this.router.navigate(['.', {method: 'done'}], options);
      }
    }
  }

  onNext(question: Question) {
    // if (this.authService.isTemporaryUser()) {
    //   return;
    // }
    if (this.idea) {
      /* Not required - handled in qa component */
      // this.questionnaireService.saveAnswers(this.stageState.answers, this.idea)
      //   .subscribe(() => {
      //     if (question) {
      //       this.stageState.nextQuestion = question.pk;
      //     }
      //   });
    } else {
      this.questionnaireService.createIdea(this.stageState.answers, false)
        .subscribe((ideaId) => {
          this.idea = ideaId;
          this.stageStorage.clearStagesState();
          // const stageState = this.stageStorage.getStageState(this.stage, this.idea);
          // if (question) {
          //   stageState.nextQuestion = question.pk;
          // }
          this.router.navigate(['.', {idea: ideaId}, this.stage], {relativeTo: this.route.parent});
        });
    }
  }

  onDone(success: any) {
    if (!this.idea) {
      if (this.authService.isTemporaryUser()) {
        this.stageStorage.saveStagesState();
        this.onToolbarClicked(this.next ? 'next' : 'home');
      } else {
        this.questionnaireService.createIdea(this.stageState.answers, true)
          .subscribe((ideaId) => {
            this.idea = ideaId;
            this.stageStorage.clearStagesState();
            this.router.navigate(['.', {idea: ideaId}, this.next], {relativeTo: this.route.parent});
          });
      }
    } else {
      this.projectsService.setVisibility({
        id: this.idea,
        is_visible: true,
      }).subscribe(() => {
        this.onToolbarClicked(this.next ? 'next' : 'home');
      });
    }
  }

  onSkip() {
    if (!this.idea) {
      if (this.authService.isTemporaryUser()) {
        this.stageStorage.saveStagesState();
        this.onToolbarClicked(this.next ? 'next' : 'home');
      } else {
        this.questionnaireService.createIdea(this.stageState.answers, true)
          .subscribe((ideaId) => {
            this.stageStorage.clearStagesState();
            this.router.navigate(['founder', 'projects', ideaId, 'summary']);
          });
      }
    } else {
      this.projectsService.setVisibility({
        id: this.idea,
        is_visible: true,
      }).subscribe(() => {
        this.router.navigate(['founder', 'projects', this.idea, 'summary']);
      });
    }
  }

  onBack() {
    if (this.isNew) {
      if (this.idea) {
        this.router.navigate(['/founder/idea', 'realization', {idea: this.idea, new: true}], {relativeTo: this.route});
      } else {
        this.router.navigate(['/founder/idea', 'realization', {method: 'new'}], {relativeTo: this.route});
      }
    } else {
      this.router.navigate(['/founder/projects']);
    }
  }
}
