import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StageStorage } from 'app/questionnaire/StageStorage';

import { QuestionnaireService } from 'app/questionnaire/questionnaire.service';
import { NDAVisibility, ProjectsService, Visibility } from 'app/projects/projects.service';

import * as _ from 'lodash';
import AnswerValidator from 'app/questionnaire/qa/AnswerValidator';
import { AuthService } from 'app/auth/auth.service';
import Answer from 'app/questionnaire/models/Answer';
import ProjectModel from 'app/projects/models/ProjectModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  providers: [
    ProjectsService,
    AnswerValidator,
    StageStorage,
  ],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class FounderProjectSummaryComponent implements OnInit {
  qaList = {
    idea: [],
    startup: [],
  };
  firstSkippedQuestion = null;
  projectStages = [
    {key: 'idea', title: 'Idea Stage'},
    {key: 'startup', title: 'Startup Stage'},
  ];
  questionGroups = {
    express: 'Express',
    develop: 'Develop',
    visual: 'Visual',
    target: 'Target',
    plan: 'Plan',
    operation_management: 'Operations Management',
    finances_outline: 'Finances Outline',
    sales_strategy: 'Sales Strategy',
    marketing_plan: 'Marketing Plan',
  };
  project = new ProjectModel();
  popUpForDocuSignModalRef: NgbModalRef;
  modalRef: NgbModalRef = null;
  editProjectTitle = false;
  projectTitle: string = null;
  private ideaId: number;

  constructor(
    private questionnaireService: QuestionnaireService,
    private projectsService: ProjectsService,
    private stageStorage: StageStorage,
    private location: Location,
    private auth: AuthService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modal: NgbModal,
  ) {
    this.ideaId = parseInt(this.activatedRoute.snapshot.params['id'], 10);
  }

  ngOnInit(): void {
    if (this.auth.isTemporaryUser()) {
      this.stageStorage.loadStagesState();
    }

    this.getProject();
  }

  saveProjectAnswers(stage: string) {
    const questions = _.reduce(this.qaList['idea'].concat(this.qaList['startup']), (result, value) => {
      return result.concat(value.list);
    }, []);

    const answers = questions.map((question) => question.answer);

    this.questionnaireService.saveAnswers(answers, this.ideaId, stage)
      .subscribe(() => {});
  }

  setProjectVisibility() {
    this.project.is_visible = !this.project.is_visible;
    this.projectsService.setVisibility(<Visibility>this.project)
      .subscribe(() => {});
  }

  setProjectNDAVisibility() {
    this.projectsService.setNDAVisibility(<NDAVisibility>this.project)
      .subscribe(() => {});
  }

  goToSkipped() {
    if (this.project.stage === 'idea') {
      this.router.navigate(['/founder/idea', 'realization', {
        idea: this.project.id,
        new: false
      }, this.firstSkippedQuestion.group]);
    } else {
      this.router.navigate(['/founder/startup', this.project.id, this.firstSkippedQuestion.group]);
    }
  }

  goToStartup() {
    this.projectsService.update({
      id: this.project.id,
      stage: 'startup',
    }).subscribe(() => {
      this.router.navigate(['/founder/startup', this.project.id]);
    });
  }

  goToProject() {
    this.router.navigate(['/founder/projects', this.project.id]);
  }

  openRegister() {
    this.router.navigate([`/founder/projects/${this.project.id}/register`]);
  }

  toggleEditProjectTitle() {
    if (this.editProjectTitle) {
      this.editProjectTitle = false;

      console.log(this.projectTitle);

      if (this.projectTitle !== this.project.title) {
        this.renameProject(this.projectTitle);
      }
    } else {
      this.editProjectTitle = true;
      this.projectTitle = this.project.title;
    }
  }

  downloadRegistrationDetails() {
    this.projectsService.downloadRegistrationDetails(this.project.id).subscribe((obj) => {
      const link = document.createElement('a');
      link.download = 'Registration_Details.pdf';

      const fileReader = new FileReader();
      const blob = new Blob([obj._body], {type: 'contentType'});
      fileReader.readAsDataURL(blob);

      fileReader.onloadend = (event: ProgressEvent) => {
        if (event.target['result']) {
          link.href = event.target['result'];
          link.click();
        }
      };
    }, (errorMsg: any) => {
      console.log(errorMsg);
    });
  }

  openLaunch() {
    this.router.navigate([`/founder/projects/${this.project.id}/launch`]);
  }

  checkNda(template) {
    this.projectsService.fetchNda(this.project.id)
      .subscribe(
        data => {
          if (data.docusign_status === 'No Nda' || (data.docusign_status.url !== undefined && data.docusign_status.url != '')) {
            this.router.navigate([`/founder/projects/${this.project.id}/nda`]);
          } else if (data.docusign_status.url === undefined) {
            this.popUpForDocuSignModalRef = this.modalService.open(template, {backdrop: false});
          }
        },
        error => {
          alert(error);
        },
      );
  }

  openModal(template) {
    this.modalRef = this.modal.open(template, {backdrop: false});
  }

  deleteProject(project: ProjectModel) {
    this.projectsService.deleteProject(project.id).subscribe(() => {
      this.modalRef.close();
      this.router.navigate([`/founder/projects/`]);
    });
  }

  renameProject(title: string) {
    this.projectsService.update({
      id: this.project.id,
      title: title,
    }).subscribe((project: ProjectModel) => {
      this.project = project;
    });
  }

  private getProject() {
    this.projectsService.get(this.ideaId)
      .subscribe((project: ProjectModel) => {
        this.project = project;
        this.fetchQAList();
      });
  }

  private fetchQAList() {
    this.questionnaireService.getProjectAnswers(this.ideaId, 'all')
      .subscribe((projectAnswers: Answer[]) => {
        this.populateQAList(projectAnswers, 'idea');
        if (this.project.stage === 'startup') {
          this.populateQAList(projectAnswers, 'startup');
        }
      });
  }

  private populateQAList(projectAnswers: Answer[], projectStage: 'idea' | 'startup') {
    return this.questionnaireService.getQuestions(projectStage)
      .subscribe((questions: any[]) => {
        const questionGroups = _.groupBy(questions, (question) => question.group);

        _.forEach(this.questionGroups, (name, key) => {
          if (questionGroups.hasOwnProperty(key)) {
            let groupQuestions = questionGroups[key];
            groupQuestions = _.sortBy(groupQuestions, (question) => question.order);
            let isAnySkipped = false;

            _.forEach(groupQuestions, (question) => {
              const answer = _.find(projectAnswers, {question: question.pk});

              question['answer'] = answer || new Answer();
              question['skipped'] = !answer;

              if (!answer) {
                isAnySkipped = true;
                if (!this.firstSkippedQuestion) {
                  this.firstSkippedQuestion = question;
                }
              }
            });

            this.qaList[projectStage].push({
              group: key,
              isCollapsed: true,
              list: groupQuestions,
              isAnySkipped: isAnySkipped,
            });
          }
        });
      });
  }
}
