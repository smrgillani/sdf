import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { WebRTCService } from 'app/common/services/webRTC.service';
import * as _ from 'lodash';
import { environment } from '../../../environments/environment';
import { AuthService } from 'app/auth/auth.service';
import { OpentokService } from '../services/opentok.service';
import { VideoCallData } from 'app/common/models/web-rtc.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-web-rtc-wrapper',
  templateUrl: './web-rtc-wrapper.component.html',
  styleUrls: ['./web-rtc-wrapper.component.scss'],
})
export class WebRtcWrapperComponent implements OnInit, OnDestroy {
  isMinimize = true;
  isCallStarted: Observable<boolean>;
  isMinimizeUp = true;
  webRTCSubscription = new Subscription();
  webRTCRoomId: string = null;
  callData: VideoCallData;
  isDockedModeRegistered: Observable<boolean>;
  isDockedModeActive: Observable<boolean>;
  incomingMessage: string = null;

  constructor(
    private webRTCService: WebRTCService,
    private authService: AuthService,
    private openTokService: OpentokService,
  ) {
  }

  ngOnInit() {
    this.isDockedModeRegistered = this.webRTCService.dockedModeStatus.asObservable().map(value => value.registered);
    this.isDockedModeActive = this.webRTCService.dockedModeStatus.asObservable().map(value => value.active);

    this.webRTCSubscription = this.webRTCService.videoCallData.subscribe(data => {
      const callData = data ? {
        roomId: data.roomId,
        autoStart: data.autoStart,
        incomingMessage: data.incomingMessage,
      } : null;

      this.webRTCRoomId = data ? data.roomId : null;
      this.callData = callData;
    });

    this.isCallStarted = this.webRTCService.videoCallSession.map(value => !!value);

    // Checking for any incoming webRTC call
    setInterval(() => {
      if (this.authService.loggedIn()) {
        this.webRTCService.getWebRTCActiveSessions()
          .subscribe((data) => {
            if (data.length > 0 && !this.webRTCRoomId) {
              const list = _.filter(data, item => item['call_status'] === 'new');

              if (!list || list.length === 0) {
                // && item['room_id']!==this.webRTCRoomId
                const activeSession = _.filter(data, item => item['call_status'] === 'joined');

                if (activeSession) {
                  for (let index = 0; index < activeSession.length; index++) {
                    this.openTokService.updateCallStatus(activeSession[index]['room_id'], 'disconnected').subscribe();
                  }
                }
              } else {
                this.webRTCService.videoCallData.next({
                  roomId: list[0]['room_id'],
                  autoStart: false,
                  incomingMessage: list[0]['caller'],
                });
              }
            } else if ((data == null || data.length === 0) && this.webRTCRoomId != null) {
              this.webRTCService.videoCallData.next(null);
            }
          });
      }
    }, environment.intervalToCheckWebRtcCall);
  }

  ngOnDestroy() {
    this.webRTCSubscription.unsubscribe();
  }

  openDockedMode() {
    this.isMinimize = true;
    this.isMinimizeUp = true;
    this.webRTCService.dockedModeStatus.next({registered: true, active: true});
  }
}
