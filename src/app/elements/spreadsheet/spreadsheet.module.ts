import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpreadsheetComponent } from './spreadsheet.component';
import { ContextMenuComponent } from './sheet-context-menu/contextmenu.component';
import { DataSvc } from './services/DataSvc';
import { WjGridSheetModule } from 'wijmo/wijmo.angular2.grid.sheet';
import { AppPipesModule } from '../../pipes/pipes.module';
import { CommonModule } from '../common/common.module';


@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    WjGridSheetModule,
    AppPipesModule,
    CommonModule,
  ],
  declarations: [
    SpreadsheetComponent,
    ContextMenuComponent,
  ],
  exports: [
    SpreadsheetComponent,
  ],
  providers: [
    DataSvc,
  ],
})
export class SpreadSheetModule {
}
