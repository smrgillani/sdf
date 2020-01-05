import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  NgbPopoverModule,
  NgbCollapseModule,
  NgbTooltipModule,
  NgbModule,
  NgbDateStruct,
  NgbAccordion
} from '@ng-bootstrap/ng-bootstrap';
import { MyPrimeNgModule } from 'app/my-prime-ng.module';
import { Ng2DatetimePickerModule } from 'ng2-datetime-picker';
import { AppElementsModule } from 'app/elements/elements.module';
import { MyInterviewRescheduleComponent } from 'app/employee/account/my-proposals/my-interview-reschedule/my-interview-reschedule.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbPopoverModule,
    NgbCollapseModule,
    NgbTooltipModule,
    NgbModule,
    MyPrimeNgModule,
    Ng2DatetimePickerModule,
    AppElementsModule,
    // NgbModal, 
    // NgbActiveModal
  ],
  declarations: [MyInterviewRescheduleComponent],
  //exports: [MyInterviewRescheduleComponent],
  entryComponents: [MyInterviewRescheduleComponent]
})
export class SharedInterviewRescheduleModule { }
