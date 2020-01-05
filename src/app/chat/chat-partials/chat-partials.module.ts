import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadSourceComponent } from './sources/file-upload-source/file-upload-source.component';
import { DrawingSourceComponent } from './sources/drawing-source/drawing-source.component';
import { FormsModule } from '@angular/forms';
import { FileDroppa } from 'file-droppa/lib/index';
import { AppElementsModule } from 'app/elements/elements.module';
import { DecisionPollOptionSourceComponent } from './sources/decision-poll-option-source/decision-poll-option-source.component';
import { MultiQuestionSourceComponent } from './sources/multi-question-source/multi-question-source.component';
import { ChatActionBarComponent } from './chat-action-bar/chat-action-bar.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AppPipesModule } from '../../pipes/pipes.module';
import { ChatFiltersComponent } from './chat-filters/chat-filters.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppPipesModule,
    PerfectScrollbarModule.forChild(),
    FileDroppa,
    AppElementsModule,
  ],
  declarations: [
    FileUploadSourceComponent,
    DrawingSourceComponent,
    DecisionPollOptionSourceComponent,
    MultiQuestionSourceComponent,
    ChatActionBarComponent,
    ChatFiltersComponent,
  ],
  exports: [
    ChatActionBarComponent,
    ChatFiltersComponent,
  ]
})
export class AppChatPartialsModule {}
