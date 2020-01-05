import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from 'app/projects/projects.service';
import ProjectModel from 'app/projects/models/ProjectModel';
import { Location } from '@angular/common';
import { ProjectNotarizationModel, NotarizeDocument, NotarizeResponse } from '../../../projects/models/project-notarization-model';
import UserProfileModel from 'app/core/models/UserProfileModel';
import { AccountService } from '../../account/account.service';

@Component({
  selector: 'app-notarization',
  templateUrl: './notarization.component.html',
  styleUrls: ['./notarization.component.scss'],
  providers: [AccountService]
})
export class NotarizationComponent implements OnInit {

  dropZoneChartTemplate: string;

  projectId: number;
  project: ProjectModel;

  notarizationInfo: ProjectNotarizationModel;
  userProfile: UserProfileModel;
  complexForm: FormGroup;
  notarizeResponse: NotarizeResponse;
  objKeyMessage: any;

  fileSize: number;
  is_fileSizeExceed: boolean = false;
  previousFileSize: number = 0;
  currentSize: number = 0;

  constructor(fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private projectsService: ProjectsService,
    private _location: Location,
  ) {

    this.complexForm = fb.group({
      'id': [''],
      'email': ['', [Validators.required, Validators.email]],
      'transaction_id': [''],
      'documentsCount': [''],
      'documents': [''],
      'common': [''],
      'is_draft': ['']
    });

    this.project = new ProjectModel();
    this.dropZoneChartTemplate = `<div class="file-droppa-document-image file-droppa-passport"></div>`;
    this.notarizationInfo = new ProjectNotarizationModel();
    this.userProfile = new UserProfileModel;
    this.notarizeResponse = new NotarizeResponse();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.getProjectNotarizeInfo();
      this.loadProject();
      // this.getUserProfile();
      // this.setValue();
    });
  }

  setValue() {
    this.complexForm.setValue({
      'id': this.notarizeResponse.id ? this.notarizeResponse.id : 0,
      'email': this.userProfile.email ? this.userProfile.email : this.notarizeResponse.email && this.notarizeResponse.email != null && this.notarizeResponse.email != '' ? this.notarizeResponse.email : '',
      'transaction_id': this.notarizeResponse.transaction_id ? this.notarizeResponse.transaction_id : '',
      //'documentsCount': this.notarizeResponse.uploaded_documents && this.notarizeResponse.uploaded_documents.length > 0 ? this.notarizeResponse.uploaded_documents.length : null,
      'documentsCount': (this.notarizationInfo.documents.length + this.notarizeResponse.uploaded_documents.length) > 0 ? (this.notarizationInfo.documents.length + this.notarizeResponse.uploaded_documents.length) : null,
      'documents': '',
      'common': '',
      'is_draft': this.notarizationInfo.is_draft ? this.notarizationInfo.is_draft : false
    });
  }

  FilesUpdated(files) {

    this.notarizationInfo.documents = [];
    this.is_fileSizeExceed = false;
    if(files && files.length > 0){
      this.currentSize = files.map(a=>a.size).reduce((sum, current) => sum + current);
      this.is_fileSizeExceed = ((this.currentSize + this.previousFileSize) > 6000000);
      
      const internalfiles: File[] = files.reverse();
      internalfiles.forEach(file => {
        const fileReader: FileReader = new FileReader();
        const self = this;
        let fileType = file.name.substring(file.name.lastIndexOf('.') + 1);        
        fileReader.addEventListener('loadend', function (loadEvent: any) {
          let doc: NotarizeDocument = new NotarizeDocument();
          doc.document = loadEvent.target.result;
          doc.document_name = file.name;
          doc.ext = fileType;
          doc.id = 0;
          doc.size = file.size;
          self.notarizationInfo.documents.push(doc);
        });
        
  
        fileReader.readAsDataURL(file);
      });
    }
  }

  loadProject() {
    this.projectsService.get(this.projectId).subscribe((project) => {
      this.project = project;
    });
  }

  getUserProfile() {
    this.accountService.getProfile().subscribe((userProfile: UserProfileModel) => {
      this.userProfile = userProfile;
      this.setValue();
    });  
  }

  /**
     * This method is called once your drop or select files
     * You can validate and decline or accept file
     *
     * @param file
     * @returns Boolean
     */
  beforeAddFile(file) {
    if (file.name.substring(file.name.toLowerCase().lastIndexOf('.') + 1) != 'pdf') {
      return false;
    }
    return true;
  }

  sendProjectNotarizeInfo(value) {
    value.documents = this.notarizeResponse.uploaded_documents && this.notarizeResponse.uploaded_documents.length > 0 ? this.notarizationInfo.documents.concat(this.notarizeResponse.uploaded_documents) : this.notarizationInfo.documents;
    
    if (this.complexForm.valid && (this.is_fileSizeExceed != undefined && !this.is_fileSizeExceed) && value.documents && value.documents.length > 0) {
        value.project = this.projectId;
        this.projectsService.postNotarizationDoc(value).subscribe((obj) => {
        this.router.navigate(['../sentnotarization'], { relativeTo: this.route });
      }, (errorMsg: any) => {
        this.checkForErrors(errorMsg);
      }
      );
    }
    else {
      this.validateAllFormFields(this.complexForm);
    }
  }

  getProjectNotarizeInfo() {
    this.projectsService.getNotarizeResponse(this.projectId).subscribe((obj) => {
      this.notarizeResponse = obj;
      //this.previousFileSize = this.notarizeResponse.uploaded_documents && this.notarizeResponse.uploaded_documents.length > 0 ? this.notarizeResponse.uploaded_documents.map(a=>a.document.length).reduce((sum, current) => sum + current) : 0;
    
      this.previousFileSize = this.notarizeResponse.uploaded_documents && this.notarizeResponse.uploaded_documents.length > 0 ? this.notarizeResponse.uploaded_documents.map(a=>a.size).reduce((sum, current) => sum + current) : 0;
      obj.transaction_id && obj.transaction_id != null && obj.transaction_id != '' ?  this.router.navigate(['../sentnotarization'], { relativeTo: this.route }) : null;
      if(obj.email && obj.email != null && obj.email != '') {
        this.setValue();
      }
      else {
        this.getUserProfile();
      }
    },
      (errorMsg: any) => {
        this.getUserProfile();
      }
    );
  }

  checkForErrors(errorMsg) {
    let newErr = {};
    this.objKeyMessage = errorMsg;
    Object.keys(errorMsg).forEach((err) => {
      newErr[err] = true;
      this.complexForm.controls[err] ? this.complexForm.controls[err].setErrors(newErr)
        : this.complexForm.controls['documentsCount'].setErrors(newErr);

      console.log(this.complexForm.controls[err].errors[err]);
    });

  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched({ onlySelf: true });

    });
  }

  removeSelectedDoc(index: number) {
    let docId = this.notarizeResponse.uploaded_documents[index].id;
    this.projectsService.deleteNotarizationDoc(docId).subscribe((obj)=>{
    });
    this.notarizeResponse.uploaded_documents.splice(index, 1);
    //this.previousFileSize = this.notarizeResponse.uploaded_documents && this.notarizeResponse.uploaded_documents.length > 0 ? this.notarizeResponse.uploaded_documents.map(a=>a.document.length).reduce((sum, current) => sum + current) : 0;
    this.previousFileSize = this.notarizeResponse.uploaded_documents && this.notarizeResponse.uploaded_documents.length > 0 ? this.notarizeResponse.uploaded_documents.map(a=>a.size).reduce((sum, current) => sum + current) : 0;
    let data = ((this.currentSize + this.previousFileSize) > 6000000);
    this.is_fileSizeExceed = data ? data : false;
  }

}
