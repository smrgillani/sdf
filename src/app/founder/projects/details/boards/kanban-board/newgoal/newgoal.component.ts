import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import FormDataPolyfill from 'formdata-polyfill/formdata.min';
import * as _ from 'lodash';
import * as moment from 'moment';

import {ProcessComponent} from './processDirective/process.component';
import {TasksService} from 'app/projects/tasks.service';
import {AccountService} from 'app/founder/account/account.service';
import UserProfileModel from 'app/core/models/UserProfileModel';
import ProjectModel from 'app/projects/models/ProjectModel';
import {ProjectsService} from 'app/projects/projects.service';
import TaskModel from 'app/core/models/TaskModel';
import {DependencyComponent} from './dependency/dependency.component';
import {MilestonesService} from 'app/projects/milestones.service';
import { LoaderService } from 'app/loader.service';
import MilestoneModel from 'app/projects/models/MilestoneModel';
import DocumentModel from 'app/core/models/DocumentModel';

@Component({
  templateUrl: './newgoal.component.html',
  entryComponents: [ProcessComponent],
  styleUrls: [
    './newgoal.component.scss'

  ] ,
  providers: [TasksService]

})
export class KanbanboardNewGoalComponent implements OnInit {
  goal: TaskModel;
  result: any;
  milestone_id: number;
  current_user: UserProfileModel;
  subtasks: TaskModel[];
  project: ProjectModel;
  project_id: number;
  milestones: any[];  
  dependencies: any[];
  msgArray = [];
  currentMilestone: MilestoneModel;
  processError: boolean;
  dropZoneChartTemplate: string;
  document: DocumentModel;
  is_fileSizeExceed: boolean = false;
  currentSize: number;

  constructor(
    private kanbanService: TasksService,
    private accountService: AccountService,
    private projectsService: ProjectsService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private milestonesService: MilestonesService,
    private loaderService: LoaderService
  ) {
    this.goal = new TaskModel();
    this.goal.due_date = new Date();
    // XXX: Status id should be got from the server
    this.goal.status = 1;

    this.project = new ProjectModel();
    this.subtasks = [];
    this.dependencies = [];
    this.currentMilestone = new MilestoneModel();
    this.processError = false;
    this.dropZoneChartTemplate = `<div class="file-droppa-document-image file-droppa-passport"></div>`;
    this.document = new DocumentModel();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.project_id = params['id'];
      this.milestone_id = params['milestoneId'];
      this.goal.title = '';
      this.goal.milestone = this.milestone_id;
      this.projectsService.get(params['id']).subscribe((project) => {
        this.project = project;
        this.goal.project = project.id;
      });
    });

    this.accountService.getProfile().subscribe(response => {
      this.current_user = response;
      this.goal.assignee = this.current_user.id;
    });

    this.getMilestones();
  }

  backBtnClicked() {
    window.history.back();
  }

// Add Process Component dynamically
  addProcessBtnClicked() {
    this.processError = false;
    const date = this.currentMilestone.date_start > new Date() ? this.currentMilestone.date_start : new Date()
      const process = {
        title: `Process ${this.subtasks.length + 1}`,
        due_date: date,
        parent_task: this.goal.id,
        milestone: this.goal.milestone,
        status: 1
      } as TaskModel;
      this.subtasks.push(process);
    /*if(this.currentMilestone.date_end >= new Date()){
    }
    else{
      this.processError = true;
    }*/
  }

  createTaskClicked() {
    this.goal.dependency_task = this.dependencies;
    /*const patchedTask: any = _.cloneDeep(this.goal);
    patchedTask.due_date = moment(this.goal.due_date).format('YYYY-MM-DD');
    let goalData = this.getFormData(patchedTask);
    let createTask = this.kanbanService.addTask(goalData);*/
    let createTask = this.kanbanService.addTask(this.goal);

    for (const subtask of this.subtasks) {
      createTask = createTask.flatMap((task: TaskModel) => {
        subtask.parent_task = task.parent_task || task.id;
        /*const patchedTask: any = _.cloneDeep(subtask);
        subtask.due_date ? patchedTask.due_date = moment(subtask.due_date).format('YYYY-MM-DD') : '';
        let subtaskData = this.getFormData(patchedTask);
        return this.kanbanService.addTask(goalData);*/
        return this.kanbanService.addTask(subtask);
      });
    }
    createTask.subscribe(() => {
      this.router.navigate(['.'], {relativeTo: this.route.parent});
    },
    (errMsg: any) => {
      console.log(errMsg);
      this.checkForErrors(errMsg);
    });
  }

  addDependencyBtnClicked() {
    let dependency = {
      milestone: null,
      task: null
    };

    this.dependencies.push(dependency);
  }
  
  getMilestones() {
    this.milestonesService.list(this.project_id).subscribe( (resp) => {
        this.milestones = [];      
        this.currentMilestone = resp.filter(a=>a.id == this.milestone_id)[0];
        resp.forEach(e=>{
          this.milestones.push({
            id: e.id, label: e.title, value: e.id          
          });
        });      
    });
  }
  
  checkForErrors(errorMsg) {
    this.msgArray = [];
    let newErr = {};
    Object.keys(errorMsg).forEach((err) => {
      const value = errorMsg[err];

      if (value[0].milestone !== undefined) {
          //this.msgArray.push(element.milestone[0]);      
          this.msgArray.push('Milestone cannot be blank');
      } else {
        this.msgArray.push(value);   
      }
         
    });
  }

  FilesUpdated(files) {
    console.log(files);


    /*const file: File = files.reverse()[0];
    const fileReader: FileReader = new FileReader();
    const self = this;
    let fileType =file.name.substring(file.name.lastIndexOf('.')+1);
    self.resumeDetail.file_name=file.name;
    // set icon on basis of fileType 
    fileReader.addEventListener('loadend', function (loadEvent: any) {     
      self.resumeDetail.resume=loadEvent.target.result;
      self.updateDropTemplate(fileType);
    });

    fileReader.readAsDataURL(file);*/

    //this.document['document'] = file;
    this.goal.documents = [];

    this.is_fileSizeExceed = false;
    if (files && files.length > 0) {
      this.currentSize = files.map(a => a.size).reduce((sum, current) => sum + current);
      this.is_fileSizeExceed = ((this.currentSize) > 6000000);

      const internalfiles: File[] = files;//files.reverse();

      internalfiles.forEach((file, index, arr) => {
        const fileReader: FileReader = new FileReader();
        const self = this;
        let fileType = file.name.substring(file.name.lastIndexOf('.') + 1);
        fileReader.addEventListener('loadend', function (loadEvent: any) {
          //let doc: WorkDocumentModel = new WorkDocumentModel();
          let doc: DocumentModel = new DocumentModel;
          doc['document'] = loadEvent.target.result;
          doc.name = file.name;
          doc['ext'] = fileType;
          doc.id = 0;
          doc['size'] = file.size;
          doc['doc_type'] = fileType == 'png' ? 'drawing' : fileType == 'xlsx' ? 'spreadsheet' : '';
          //self.document = doc;
          self.goal.documents.push(doc);
          self.goal.uploaded_document = doc;
          //self.goal.documents.push(self.getFormData());
        });
        //fileReader.readAsBinaryString(file);// readAsArrayBuffer(file); //readAsDataURL(file);
        fileReader.readAsDataURL(file);
        //fileReader.readAsArrayBuffer(file);
      });
    }
  }

  /**
   * This method is called once your drop or select files
   * You can validate and decline or accept file
   *
   * @param file
   * @returns Boolean
   */
  beforeAddFile(file) {
    let fileExt: string = file.name.substring(file.name.toLowerCase().lastIndexOf('.') + 1);
    if (fileExt) {
      return true;
    }
    return false;
  }

  getFormData(data): FormDataPolyfill {
    // let file: File;
    // this.document['document'] = file;

    /*let content = this.content;

    if (this.document.doc_type === 'document') {
      this.document['ext'] = 'html';
    } else if (this.document.doc_type === 'diagram') {
      this.document['ext'] = 'xml';
    } else if (this.document.doc_type === 'spreadsheet') {
      const arrayBuffer = this.base64ToArrayBuffer(this.content);
      const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      content = new Blob([arrayBuffer], { type: fileType });
      this.document['ext'] = 'xlsx';
    } else if (this.document.doc_type === 'ocr') {
      this.document['ext'] = 'txt';
    } else if (this.document.doc_type === 'presentation') {
      this.document['ext'] = 'html';
    } else if (this.document.doc_type === 'drawing') {
      this.document['ext'] = 'png';
    }

    file = new File(this.document.doc_type === 'ocr' ? [content.content] : [content], `${this.document.name}.${this.document['ext']}`);
    this.document['document'] = file;

    if (this.document.doc_type === 'ocr') {
      this.document['ocr_image'] = this.content.ocr_image;
    }*/

    const formData = new FormDataPolyfill();

    /*for (const key in this.document) {
      if (this.document[key]) {
        formData.append(key, this.document[key]);
      }
    }*/
    for (const key in data) {
      if (data[key]) {
        //formData.append(key, data[key]);
        if(key == 'documents') {
          const formData1 = new FormDataPolyfill();
          for(const doc in data[key]) {
            //formData1.append(doc, data[key][doc]);  
            formData.append(key, data[key][doc])
          }
          //formData.append(key, formData1)
        }
        else if(key == 'uploaded_document') {
          for(const doc in data[key]) {
            formData.append(doc, data[key][doc]);
          }
        }
        else {
          formData.append(key, data[key]);
        }
      }
    }

    console.log(formData.toString());
    return formData;
  }

}
