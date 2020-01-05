import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebCamComponent } from 'ack-angular-webcam';
import {ImageCropperComponent} from 'ng2-img-cropper';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    WebCamComponent,
    ImageCropperComponent,
  ],
  exports:[
    WebCamComponent,
    ImageCropperComponent,
  ]
})
export class SharedModule { }
