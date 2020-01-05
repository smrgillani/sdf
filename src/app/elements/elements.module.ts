import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbPaginationModule,
  NgbPopoverModule,
  NgbTimepickerModule,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FileDroppa } from 'file-droppa/lib/index';
import { TextMaskModule } from 'angular2-text-mask';

import { NavbarModule } from 'app/core/navbar/navbar.module';
import { ValidationMessageComponent } from './validation/validation-message.component';
import { AnswerInputComponent } from './answer-input/answer-input.component';
import { RegistrationAnswerInputComponent } from './registration-answer-input/registration-answer-input.component';
import { DateInputComponent } from './date-input/date-input.component';
import { DocumentExplorerComponent } from './document-explorer/document-explorer.component';
import { DocumentItemComponent } from './document-explorer/document-item/document-item.component';
import { FolderItemComponent } from './document-explorer/folder-item/folder-item.component';
import { FolderSelectComponent } from './document-explorer/folder-select/folder-select.component';
import { GanttChartComponent } from './gantt-chart/gantt-chart.component';
import { GanttChartWorkItemComponent } from './gantt-chart/work-item/work-item.component';
import { HeaderComponent } from './header/header.component';
import { HeaderContainerComponent } from './containers/header-container/header-container.component';
import { ImportToolbarComponent } from './import-toolbar/import-toolbar.component';
import { MainContainerComponent } from './containers/main-container/main-container.component';
import { OtpInputComponent } from './otp-input/otp-input.component';
import { PaginationComponent } from './pagination/pagination.component';
import { PhoneInputComponent } from './phone-input/phone-input.component';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { TimeInputComponent } from './time-input/time-input.component';
import { WheelComponent } from './wheel/wheel.component';
import { AppPopoverAutoPositionDirective } from 'app/elements/popover/popover-auto-position.directive';
import { AppPopoverCloseOuterClickDirective } from 'app/elements/popover/popover-close-outer-click.directive';
import { SpreadSheetModule } from './spreadsheet/spreadsheet.module';
import { EditDrawingComponent } from './edit-drawing/edit-drawing.component';
import { EditDrawingToolbarComponent } from './edit-drawing/edit-drawing-toolbar/edit-drawing-toolbar.component';
import { FilterDocumentTypePipe } from './document-explorer/pipes/filter-document-type.pipe';
import { MatchHeightDirective } from './match-height/match-height.directive';
import { EditorabletextDirective } from './editable-text/editorabletext.directive';
import { MyPrimeNgModule } from 'app/my-prime-ng.module';
import { VdCanvasComponent } from './vd-canvas/vd-canvas.component';
import { vdCanvasColorPickerComponent } from './vd-canvas/vd-canvas-color-picker.component';
import { vdCanvasTextToolbarComponent } from './vd-canvas/vd-canvas-text-toolbar.component';
import { vdCanvasBrushToolbarComponent } from './vd-canvas/vd-canvas-brush-toolbar.component';
import { SharedModule } from 'app/shared/shared.module';
import { SwotAnalysisComponent } from './swot-analysis/swot-analysis.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { FormatSelectItemPipe } from 'app/pipes/format-select-item.pipe';
import { UploadCaptureImageComponent } from 'app/elements/upload-capture-image/upload-capture-image.component';
import { SearchProductComponent } from './search-product/search-product.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ConfirmationService } from 'primeng/primeng';
import { OcrInputComponent } from './ocr-input/ocr-input.component';
import { SearchCompanyComponent } from './search-company/search-company.component';
import { HammertimeDirective } from './hammertime/hammertime.directive';
import { TextareahgtDirective } from './textareahgt/textareahgt.directive';
import { AppPipesModule } from 'app/pipes/pipes.module';
import { PresentationInputComponent } from './presentation-input/presentation-input.component';
import { TextEditorChatComponent } from './text-editor-chat/text-editor-chat.component';
import { SearchCompanyCompareComponent } from './search-company-compare/search-company-compare.component';
import { ExtensionApproveRejectComponent } from './notifications/extension-approve-reject/extension-approve-reject.component';
import { TempCommonMessageComponent } from './temp-common-message/temp-common-message.component';
import { EventInvitationStatusComponent } from './notifications/event-invitation-status/event-invitation-status.component';
import {
  ServiceExtensionApproveRejectComponent
} from './notifications/service-extension-approve-reject/service-extension-approve-reject.component';
import { BonusHikeRejectStatusComponent } from './notifications/bonus-hike-reject-status/bonus-hike-reject-status.component';
import { BusinessAddressComponent } from './business-address/business-address.component';
import { ServiceProcessComponent } from './service-process/service-process.component';
import { MilestoneActivityComponent } from './milestone-activity/milestone-activity.component';
import { CommonModule } from './common/common.module';
import { DocumentsService } from '../projects/documents.service';
import { DeletePromptComponent } from './delete-prompt/delete-prompt.component';
import { InfoPromptComponent } from './info-prompt/info-prompt.component';
import { SelectInputComponent } from './select-input/select-input.component';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  imports: [
    NgCommonModule,
    NgbModule,
    FormsModule,
    NavbarModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbPopoverModule,
    NgbTimepickerModule,
    TextMaskModule,
    FileDroppa,
    SpreadSheetModule,
    MyPrimeNgModule,
    SharedModule,
    PerfectScrollbarModule,
    AppPipesModule,
    CommonModule,
  ],
  exports: [
    AnswerInputComponent,
    RegistrationAnswerInputComponent,
    DateInputComponent,
    DocumentExplorerComponent,
    FilterDocumentTypePipe,
    FormatSelectItemPipe,
    FolderSelectComponent,
    GanttChartComponent,
    HeaderComponent,
    HeaderContainerComponent,
    ImportToolbarComponent,
    MainContainerComponent,
    OtpInputComponent,
    PaginationComponent,
    PhoneInputComponent,
    TextEditorComponent,
    TimeInputComponent,
    WheelComponent,
    UploadCaptureImageComponent,
    ValidationMessageComponent,
    AppPopoverAutoPositionDirective,
    AppPopoverCloseOuterClickDirective,
    EditDrawingComponent,
    MatchHeightDirective,
    EditorabletextDirective,
    VdCanvasComponent,
    vdCanvasColorPickerComponent,
    vdCanvasTextToolbarComponent,
    vdCanvasBrushToolbarComponent,
    OcrInputComponent,
    TextareahgtDirective,
    PresentationInputComponent,
    TextEditorChatComponent,
    MilestoneActivityComponent,
    SelectInputComponent
  ],
  declarations: [
    AnswerInputComponent,
    RegistrationAnswerInputComponent,
    DateInputComponent,
    DocumentExplorerComponent,
    DocumentItemComponent,
    FilterDocumentTypePipe,
    FormatSelectItemPipe,
    FolderItemComponent,
    FolderSelectComponent,
    GanttChartComponent,
    GanttChartWorkItemComponent,
    HeaderComponent,
    HeaderContainerComponent,
    ImportToolbarComponent,
    MainContainerComponent,
    OtpInputComponent,
    PaginationComponent,
    PhoneInputComponent,
    TextEditorComponent,
    TimeInputComponent,
    WheelComponent,
    UploadCaptureImageComponent,
    ValidationMessageComponent,
    AppPopoverAutoPositionDirective,
    AppPopoverCloseOuterClickDirective,
    EditDrawingComponent,
    EditDrawingToolbarComponent,
    MatchHeightDirective,
    EditorabletextDirective,
    VdCanvasComponent,
    vdCanvasColorPickerComponent,
    vdCanvasTextToolbarComponent,
    vdCanvasBrushToolbarComponent,
    SwotAnalysisComponent,
    BusinessAddressComponent,
    ServiceProcessComponent,
    NotificationsComponent,
    SearchProductComponent,
    OcrInputComponent,
    SearchCompanyComponent,
    HammertimeDirective,
    TextareahgtDirective,
    PresentationInputComponent,
    TextEditorChatComponent,
    SearchCompanyCompareComponent,
    ExtensionApproveRejectComponent,
    TempCommonMessageComponent,
    EventInvitationStatusComponent,
    ServiceExtensionApproveRejectComponent,
    BonusHikeRejectStatusComponent,
    MilestoneActivityComponent,
    DeletePromptComponent,
    InfoPromptComponent,
    SelectInputComponent,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    ConfirmationService,
    DocumentsService,
  ],
  entryComponents: [
    ExtensionApproveRejectComponent,
    EventInvitationStatusComponent,
    ServiceExtensionApproveRejectComponent,
    BonusHikeRejectStatusComponent,
    TempCommonMessageComponent,
  ],
})
export class AppElementsModule {
}
