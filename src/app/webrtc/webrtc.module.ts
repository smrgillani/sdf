import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpentokService } from './services/opentok.service';
import { WebRtcMainComponent } from './web-rtc/web-rtc-main.component';
import { WebRtcWrapperComponent } from './web-rtc-wrapper/web-rtc-wrapper.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    WebRtcMainComponent,
    WebRtcWrapperComponent,
  ],
  exports: [
    WebRtcWrapperComponent,
    WebRtcMainComponent,
  ],
  providers: [
    OpentokService,
  ],
})
export class WebrtcModule {
}
