import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {NgbPopoverModule, NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {FounderAccountRoutingModule} from './account.routings';
import {AccountComponent} from './account.component';
import {ViewAccountComponent} from './detail/detail.component';
import {EditAccountComponent} from './edit/edit.component';
import {EditAccountPhotoComponent} from './edit-photo/edit-photo.component';
import {NavbarModule} from '../../core/navbar/navbar.module';
import {FileDroppa} from 'file-droppa/lib/index';
import {AppElementsModule} from '../../elements/elements.module';
import { SharedModule } from 'app/shared/shared.module';
import {MyPrimeNgModule} from '../../my-prime-ng.module';


@NgModule({
  imports: [
    CommonModule,
    FounderAccountRoutingModule,
    NavbarModule,
    FormsModule,
    FileDroppa,
    NgbTypeaheadModule,
    NgbPopoverModule,
    AppElementsModule,
    SharedModule,
    MyPrimeNgModule,

  ],
  declarations: [
    AccountComponent,
    ViewAccountComponent,
    EditAccountComponent,
    EditAccountPhotoComponent,
  ]
})
export class FounderAccountModule { }
