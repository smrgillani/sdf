import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from 'app/founder/order-service/overview/overview.component';
import { NewServiceComponent } from 'app/founder/order-service/new-service/new-service.component';
import { UpdatedNewServiceComponent } from 'app/founder/order-service/updated-new-service/updated-new-service.component';
import { CreatorServiceWorkAreaComponent } from 'app/founder/order-service/creator-service-work-area/creator-service-work-area.component';
import { ServicesDocumentsComponent } from 'app/founder/order-service/creator-service-work-area/services-documents/services-documents.component';
import { ServiceDocumentComponent } from 'app/founder/order-service/creator-service-work-area/service-document/service-document.component';

const routes: Routes = [
  {
    path: '',
    component: OverviewComponent
  },
  {
    path: 'old-new',
    component: NewServiceComponent
  },
  {
    path: 'new',
    component: UpdatedNewServiceComponent
  },
  {
    path: ':orderid/work-area',
    component: CreatorServiceWorkAreaComponent,
    children: [
      {path: '', component: ServicesDocumentsComponent},
      {path: 'document/:documentId', component: ServiceDocumentComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderServiceRoutingModule { }
