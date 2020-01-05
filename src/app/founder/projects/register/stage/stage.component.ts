import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';

import RegistrationStageState from 'app/founder/projects/register/questionnaire/RegistrationStageState';
import { RegistrationStageStorage } from 'app/founder/projects/register/questionnaire/RegistrationStageStorage';
import ProjectModel from 'app/projects/models/ProjectModel';
import { ProjectsService } from 'app/projects/projects.service';
import RegistrationQuestion from 'app/founder/projects/register/questionnaire/models/RegistrationQuestion';
import {AuthService} from 'app/auth/auth.service';
import { RegistrationQuestionnaireService } from 'app/founder/projects/register/questionnaire/RegistrationQuestionnaireService';

@Component({
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.scss']
})
export class StageComponent implements OnInit {
  title: string;
  subtitle: string;
  projectId: number;
  entityType:number;
  stage: string;
  previous?: string;
  next?: string;
  stageState:RegistrationStageState;
  loadStage:boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private stageStorage: RegistrationStageStorage,
    private projectsService: ProjectsService,
    private authService: AuthService,
    private questionnaireService: RegistrationQuestionnaireService
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
        this.projectsService.get(this.projectId).subscribe((project: ProjectModel)=>{
          if(project.registration_type)
          {
            this.entityType = project.registration_type;
            this.loadState();
          }
          else{
            //if entity type not selected then redirect to entity page.
            this.router.navigate(['entity'], {relativeTo: this.route.parent});
          }
        });
      });
    }

    loadState() {
      this.stageState = this.stageStorage.getStageState(this.stage, this.projectId);
      if (this.projectId) {
        this.stageStorage.loadAnswers(this.projectId, this.entityType).subscribe((stageState) => {
          if (stageState.stage === this.stage) {
            this.stageState = stageState;
          }
          this.loadStage = true;
        });
      } else {
        this.stageStorage.loadStagesState(this.projectId);
      }
    }

    // onNext(question: RegistrationQuestion) {
    //   if (this.authService.isTemporaryUser()) {
    //     return;
    //   }
    //   this.questionnaireService.saveAnswers(this.stageState.answers, this.projectId)
    //   .subscribe(() => {
    //     if (question) {
    //       this.stageState.nextQuestion = question.id;
    //     }
    //   });
    // }

    onDone(success: any) {
      this.projectsService.setVisibility({
        id: this.projectId,
        is_visible: true
      }).subscribe(() => {
        // this.router.navigate(['register'], {relativeTo: this.route.parent});
        this.router.navigate(['.', 'register', this.next], {relativeTo: this.route.parent});
      });
    }
}
