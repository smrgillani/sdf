import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { ProjectsService } from 'app/projects/projects.service';
import { ProjectRegisterService } from "app/projects/register.service";
import {AuthService} from 'app/auth/auth.service';
import ProjectModel from "app/projects/models/ProjectModel";
import RegistrationPackageModel from "app/projects/models/RegistrationPackageModel";
import RegistrationStageState from "app/founder/projects/register/questionnaire/RegistrationStageState";
import { RegistrationStageStorage } from "app/founder/projects/register/questionnaire/RegistrationStageStorage";
import * as _ from 'lodash';
import { _finally } from "rxjs/operator/finally";
import { RegistrationQuestionnaireService } from "../../questionnaire/RegistrationQuestionnaireService";
import RegistrationAnswer from "app/founder/projects/register/questionnaire/models/RegistrationAnswer";
import RegistrationAnswerValidator from "../../questionnaire/qa/AnswerValidator";
import { REGISTER_STAGES } from "app/founder/projects/register/register.constants";

@Component({
    templateUrl:'./placeorder.component.html',
    styleUrls:['./placeorder.component.scss'],
    providers:[RegistrationAnswerValidator]
})
export class PlaceOrderComponent implements OnInit{
    title: string;
    subtitle: string;
    projectId: number;
    entityType:number;
    stage: string;
    stageState:RegistrationStageState;
    entityTypeDetails:{id:number,title:string,amount:number,description:string} = {id:null,title:'',amount:null,description:''};
    availablePackages:RegistrationPackageModel[];
    qaList = [];
    showSummary:boolean = true;
    registerationStages: any[] = REGISTER_STAGES;
    errorMessages:any = [];

    questionGroups = {
      about_business: 'About Business',
      name_and_address: 'Name And Address',
      owners_and_mgmt: 'Owners and Mgmt',
      tax_setup: 'Tax Setup',
      business_setup: 'Business Setup'
    };

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private stageStorage: RegistrationStageStorage,
        private projectsService: ProjectsService,
        private registerService: ProjectRegisterService,
        private authService: AuthService,
        private questionnaireService:RegistrationQuestionnaireService
      ) {
          this.title = route.snapshot.data['title'];
          this.subtitle = route.snapshot.data['subtitle'];
      }

      ngOnInit(): void {
        this.route.params.subscribe((params) => {
          this.projectId = params['id'];
          this.projectsService.get(this.projectId).subscribe((project: ProjectModel)=>{
            if(project.registration_type)
            {
              this.entityType = project.registration_type;
              this.loadState();
              this.getEntityType();
              this.getRegistrationPackages();
              this.fetchQAList();
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
          });
        } else {
          this.stageStorage.loadStagesState(this.projectId);
        }
      }

      getEntityType(){
        this.registerService.getEntity(this.entityType).subscribe((ent:any)=>{
            this.entityTypeDetails = ent;
          });
      }

      getRegistrationPackages(){
        this.registerService.getRegistrationPackages(this.entityType).subscribe((packages:RegistrationPackageModel[])=>{
            this.availablePackages = packages;
          });
      }

      getFeatureAvailablity(packageId:number, feature_id:number){
        const currentPackage = _.find(this.availablePackages,(p)=>p.id === packageId);
        const currentFeature = _.find(currentPackage.features, (q) => q.feature_id === feature_id);

        if (currentFeature) {
          if(currentFeature.feature_value_type==='boolean'){
            return currentFeature.is_available?'Yes':'No';
          }
          else{
            return currentFeature.value;
          }
        }
        else{
            return 'No';
        }
      }

      onSelectPackage(selectedPack: RegistrationPackageModel){
        const today = new Date();
        this.projectsService.projectRegistration(this.projectId,selectedPack.id,today).subscribe(() => {
          this.router.navigate(['register', 'projectregistered'], {relativeTo: this.route.parent});
        },(error)=>{
          this.errorMessages = error;
          setTimeout(() => {
            this.errorMessages = [];
          }, 4000);
        }
      );
        // this.projectsService.update({
        //     id: this.projectId,
        //     package:selectedPack.id,
        //     is_registered:true
        //   }).subscribe(() => {
        //     this.router.navigate(['projectregistered'], {relativeTo: this.route.parent});
        //   });
      }

      fetchQAList() {
        this.questionnaireService.getProjectAnswers(this.projectId,'registration')
          .subscribe((projectAnswers: RegistrationAnswer[]) => {
            this.populateQAList(projectAnswers);
          });
      }

      populateQAList(projectAnswers: RegistrationAnswer[]) {
        return this.questionnaireService.getQuestions(this.entityType)
          .subscribe((questions: any[]) => {
            questions = _.filter(
              questions, (question) => question['stage'] === 'registration'
            );
            for (const stage of this.registerationStages) {
              if(stage.url==='placeorder')
              {
                continue;
              }

              let lst = _.filter(
                questions, (question) => question['group'] === stage.url
              );

              lst = _.sortBy(lst, (question) => question.order);
              _.forEach(lst, (question) => {
                question['answer'] = _.find(projectAnswers, {question: question.id}) || new RegistrationAnswer();
              });

              this.qaList.push({
                group: stage.url,
                isCollapsed: true,
                list: lst
              });
            }
          });
      }

      saveProjectAnswers() {
        const questions = _.reduce(this.qaList, (result, value) => {
          return result.concat(value.list);
        }, []);

        const answers = questions.map((question) => question.answer);

        this.questionnaireService.saveAnswers(answers,this.projectId)
          .subscribe(() => {});
      }
}
