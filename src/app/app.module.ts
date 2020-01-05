import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { Ng2DeviceDetectorModule } from 'ng2-device-detector';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';

import { CoreModule } from './core/core.modules';
import { AuthModule } from './auth/auth.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { TermsOfUseContent } from './home/terms-of-use/terms-of-use.component';
import { environment } from 'environments/environment';
import { MessagingService } from 'app/core/messaging.service';
// import 'hammerjs';
import { WebrtcModule } from 'app/webrtc/webrtc.module';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { LoaderService } from './loader.service';

// import { MatchHeightDirective } from './elements/match-height/match-height.directive';
import * as Hammer from 'hammerjs';

import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { CancelPaymentComponent } from './cancel-payment.component';
import { WebRTCService } from './common/services/webRTC.service';
import { MyPrimeNgModule } from './my-prime-ng.module';
import { WebSocketService } from './common/services/webSocket.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { DeletePromptComponent } from './elements/delete-prompt/delete-prompt.component';
import { InfoPromptComponent } from './elements/info-prompt/info-prompt.component';

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    // override hammerjs default configuration
    'swipe': {direction: Hammer.DIRECTION_ALL},
  };
}


@NgModule({
  declarations: [
    AppComponent,
    TermsOfUseContent,
    CancelPaymentComponent,
  ],
  imports: [
    NgbModule.forRoot(),
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    Ng2DeviceDetectorModule.forRoot(),
    CommonModule,
    CoreModule,
    AuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    WebrtcModule,
    LoadingModule,
    MyPrimeNgModule,
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy,
  },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
    MessagingService,
    LoaderService,
    WebRTCService,
    WebSocketService,
  ],
  // entryComponents: [TermsOfUseContent],
  entryComponents: [TermsOfUseContent, DeletePromptComponent, InfoPromptComponent],
  bootstrap: [AppComponent],
})
export class AppModule {
}
