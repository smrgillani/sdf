import {NgModule} from '@angular/core';
import {
  CheckboxModule,
  ConfirmDialogModule,DropdownModule,SelectItem,CalendarModule,MultiSelectModule,AccordionModule,
  GrowlModule, InputMaskModule, InputSwitchModule, InputTextareaModule, InputTextModule, ListboxModule,
  MessagesModule, OverlayPanelModule, RadioButtonModule, SpinnerModule, ToggleButtonModule, TooltipModule,DataTableModule,
  DialogModule,CarouselModule,FieldsetModule, AutoCompleteModule
} from 'primeng/primeng';


@NgModule({
  imports: [
    MessagesModule,
    GrowlModule,
    CheckboxModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextareaModule,
    InputMaskModule,
    ListboxModule,
    SpinnerModule,
    ToggleButtonModule,
    InputTextModule,
    RadioButtonModule,
    DropdownModule,
    CalendarModule,
    MultiSelectModule,
    ConfirmDialogModule,
    TooltipModule,
    OverlayPanelModule,
    DataTableModule,
    DialogModule,
    AccordionModule,
    CarouselModule,
    FieldsetModule,
    AutoCompleteModule
  ],
  exports: [
    MessagesModule,
    GrowlModule,
    CheckboxModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextareaModule,
    InputMaskModule,
    ListboxModule,
    SpinnerModule,
    ToggleButtonModule,
    InputTextModule,
    RadioButtonModule,
    DropdownModule,
    CalendarModule,
    MultiSelectModule,
    ConfirmDialogModule,
    TooltipModule,
    OverlayPanelModule,
    DataTableModule,
    AccordionModule,
    CarouselModule,
    FieldsetModule,
    AutoCompleteModule
  ]
})
export class MyPrimeNgModule {}
