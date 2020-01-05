import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BackerServiceWorkAreaComponent } from './backer-service-work-area.component';
import { BackerServicesDocumentsComponent } from './backer-services-documents/backer-services-documents.component';
import { BackerServiceDocumentComponent } from './backer-service-document/backer-service-document';


const routes: Routes = [
  {
    path: '',
    component: BackerServiceWorkAreaComponent,
    children: [
      {path: '', component: BackerServicesDocumentsComponent},
      {path: 'document/:documentId', component: BackerServiceDocumentComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackerServiceWorkAreaRoutingModule { }
