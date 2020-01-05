import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MyProposalRoutingModule } from './my-proposal-routing.module';
import { MyInterviewComponent } from './my-interview/my-interview.component';
import { MyAppointmentLetterComponent } from './my-appointment-letter/my-appointment-letter.component';
import { MyInterviewRescheduleComponent } from './my-interview-reschedule/my-interview-reschedule.component';
import { DirectHireComponent } from './direct-hire/direct-hire.component';

@NgModule({
  imports: [
    CommonModule,
    MyProposalRoutingModule,
    FormsModule
  ],
  declarations: [MyInterviewComponent, MyAppointmentLetterComponent, MyInterviewRescheduleComponent, DirectHireComponent]//,
  //entryComponents: [MyInterviewRescheduleComponent]
})
export class MyProposalModule { }
