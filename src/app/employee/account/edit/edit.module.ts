import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {ResponsiveModule} from 'ng2-responsive';
import {NgbCollapseModule, NgbPopoverModule,NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';

import { EditRoutingModule } from './edit.routing';
import { StageComponent } from './stage/stage.component';
import { NavbarComponent } from './stage/navbar/navbar.component';
import { BasicInfoComponent } from './stage/basic-info/basic-info.component';
import { ProfessionalInfoComponent } from './stage/professional-info/professional-info.component';
import { EmploymentInfoComponent } from './stage/employment-info/employment-info.component';
import { WorkSampleInfoComponent } from './stage/work-sample-info/work-sample-info.component';
import { AvailabilityInfoComponent } from './stage/availability-info/availability-info.component';
//import { ContactInfoComponent } from './stage/contact-info/contact-info.component';
import {NavbarModule} from 'app/core/navbar/navbar.module';
import {AppElementsModule} from 'app/elements/elements.module';
import { FileDroppa } from 'file-droppa/lib/index';
import {MyPrimeNgModule} from '../../../my-prime-ng.module';
import { EditPhotoComponent } from './stage/edit-photo/edit-photo.component';
import { SharedModule } from 'app/shared/shared.module';
import {ConfirmationService} from 'primeng/primeng';


@NgModule({
  imports: [
    CommonModule,
    NavbarModule,
    FormsModule,
    ReactiveFormsModule,
    ResponsiveModule,
    PerfectScrollbarModule.forRoot(),
    NgbCollapseModule.forRoot(),
    NgbPopoverModule,
    NgbTypeaheadModule,
    AppElementsModule,
    MyPrimeNgModule,    
    EditRoutingModule,
    FileDroppa,
    SharedModule
  ],
  declarations: [
    StageComponent, 
    NavbarComponent, 
    BasicInfoComponent, 
    ProfessionalInfoComponent, 
    EmploymentInfoComponent, 
    WorkSampleInfoComponent, 
    AvailabilityInfoComponent, 
    //ContactInfoComponent, 
    EditPhotoComponent,
  ],
  providers: [ConfirmationService]
})
export class EditModule { }
