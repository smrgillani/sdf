import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {QuestionnaireService} from 'app/questionnaire/questionnaire.service';
import {ProjectsService} from 'app/projects/projects.service';

import * as _ from 'lodash';
import AnswerValidator from 'app/questionnaire/qa/AnswerValidator';
import {AuthService} from 'app/auth/auth.service';
import Answer from 'app/questionnaire/models/Answer';
import ProjectModel from 'app/projects/models/ProjectModel';
import {StageStorage} from 'app/questionnaire/StageStorage';
import { vdCanvasService } from '../../../elements/vd-canvas/vd-canvas.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  providers: [
    ProjectsService,
    AnswerValidator,
    QuestionnaireService,
    vdCanvasService,
    StageStorage
  ],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class MyProjectsSummaryComponent implements OnInit {

  // qaList = [];
  projectStages = [
    {key: 'idea', title: 'Idea Stage'},
    {key: 'startup', title: 'Startup Stage'}
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
    marketing_plan: 'Marketing Plan'
  };
  qaList = {
    idea: [],
    startup: []
  };
  ideaId: number;
  project: ProjectModel;

  ndaData: { 'id': string, 'description': string, 'creator_email': string, 'docusign_status': any }
  = { 'id': '', 'description': '', 'creator_email': '', 'docusign_status': '' };
  
  isNdaPending: boolean = false;
  popUpForDocuSignModalRef: NgbModalRef;

  constructor(
    private questionnaireService: QuestionnaireService,
    private projectsService: ProjectsService,
    private location: Location,
    private router: Router,
    private auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private stageStorage: StageStorage
  ) {
    this.ideaId = parseInt(this.activatedRoute.snapshot.params['id'], 10);
    this.project = new ProjectModel();
  }

  ngOnInit(
  ): void {
    if (this.auth.isTemporaryUser()) {
      this.stageStorage.loadStagesState();
    }
    this.getProject();
    // this.getQAList();
  }

  getProject() {
    this.projectsService.getPublished(this.ideaId)
      .subscribe((project: ProjectModel) => {
        this.project = project;
        if (this.project.show_nda && this.project.add_nda) {
          this.fetchNda(this.project.id);
        }
        else {
          this.fetchQAList();
        }
      });
  }

  checkNda(template) {
    if (this.ndaData.id === '' ||
      (this.ndaData.docusign_status != 'No Nda'
        && !this.ndaData.docusign_status['status']
        && !this.ndaData.docusign_status['url'])) {
      // this.fetchQAList();
    }
    else {
      if (this.ndaData.docusign_status == 'No Nda') {
        this.router.navigate([`/backer/projects/${this.project.id}/nda`]);
      }
      else if (this.ndaData.docusign_status['url']) {
        this.projectsService.downloadDocusign(this.ndaData.docusign_status['url'])
          .subscribe((obj) => {
            var link = document.createElement('a');
            link.download = `NDA_${this.project.title}_Docusign.pdf`;

            const fileReader = new FileReader();
            fileReader.readAsDataURL(obj);
            fileReader.onloadend = (event: ProgressEvent) => {
              if (event.target['result']) {
                link.href = event.target['result'];
                link.click();
              }
            };
          });
      }
      else if (this.ndaData.docusign_status.url == undefined) {
        this.popUpForDocuSignModalRef = this.modalService.open(template, { backdrop: false });
      }
    }
  }

  fetchNda(projectId: number) {
    this.projectsService.fetchNdaForBacker(projectId)
      .subscribe(
        data => {
          this.ndaData.id = (data.id == undefined) ? '' : data.id;
          if (this.ndaData.id != '') {
            this.ndaData.description = data.description;
          }
          this.ndaData.docusign_status = data.docusign_status;

          if (this.ndaData.id === '' || (this.ndaData.docusign_status != 'No Nda' && !this.ndaData.docusign_status['status'])) {
            this.fetchQAList();
          }
          else {
            if (this.ndaData.docusign_status == 'No Nda') {
              this.router.navigate([`/backer/projects/${this.project.id}/nda`]);
            }
            else {
              this.isNdaPending = true;
            }
          }
        },
        error => {
          alert(error);
        }
      );
  }

  fetchQAList() {
    this.questionnaireService.getPublishedAnswers(this.ideaId)
      .subscribe((projectAnswers: Answer[]) => {
        this.populateQAList(projectAnswers, 'idea');
        if (this.project.stage === 'startup') {
          this.populateQAList(projectAnswers, 'startup');
        }
      });
  }

  populateQAList(projectAnswers: Answer[], projectStage: 'idea' | 'startup') {
    return this.questionnaireService.getQuestions(projectStage)
      .subscribe((questions: any[]) => {
        const questionGroups = _.groupBy(questions, (question) => question.group);
        _.forEach(questionGroups, (groupQuestions, groupKey) => {
          groupQuestions = _.sortBy(groupQuestions, (question) => question.order);

          _.forEach(groupQuestions, (question) => {
            question['answer'] = _.find(projectAnswers, {question: question.pk}) || new Answer();
          });

          this.qaList[projectStage].push({
            group: groupKey,
            isCollapsed: true,
            list: groupQuestions
          });
        });
      });
  }
}
