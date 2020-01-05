import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdeaNavBarComponent } from '../navbar/navbar.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    IdeaNavBarComponent,
  ],
  exports: [

    IdeaNavBarComponent,
  ],
})
export class IdeaSharedModule {
}
