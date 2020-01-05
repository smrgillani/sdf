import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewBasicInfoComponent } from 'app/founder/projects/employee-profile/basic-info/basic-info.component';
import { ViewProfessionalInfoComponent } from 'app/founder/projects/employee-profile/professional-info/professional-info.component';
import { PastExperienceComponent } from 'app/founder/projects/employee-profile/past-experience/past-experience.component';
import { WorkSampleComponent } from 'app/founder/projects/employee-profile/work-sample/work-sample.component';
import { AvailabilityComponent } from 'app/founder/projects/employee-profile/availability/availability.component';
import { DocuSigndocpreviewComponent } from 'app/founder/projects/employee-profile/docu-signdocpreview/docu-signdocpreview.component';
import {
  NgbPopoverModule,
  NgbCollapseModule,
  NgbTooltipModule,
  NgbModule,
  NgbDateStruct,
  NgbRating
} from '@ng-bootstrap/ng-bootstrap';
import {AppPipesModule} from 'app/pipes/pipes.module';


@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    NgbPopoverModule,
    NgbCollapseModule,
    NgbTooltipModule,
    AppPipesModule
  ],
  declarations: [
    ViewBasicInfoComponent, 
    ViewProfessionalInfoComponent,
    PastExperienceComponent,
    WorkSampleComponent,
    AvailabilityComponent,
    DocuSigndocpreviewComponent,
  ],
  exports:[
    ViewBasicInfoComponent, 
    ViewProfessionalInfoComponent,
    PastExperienceComponent,
    WorkSampleComponent,
    AvailabilityComponent,
    DocuSigndocpreviewComponent,
  ],
  entryComponents: [DocuSigndocpreviewComponent]
})
export class SharedEmployeeModule { }
