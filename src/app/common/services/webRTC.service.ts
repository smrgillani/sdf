import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ApiService } from 'app/core/api/api.service';
import { VideoCallData, DockedModeStatus } from '../models/web-rtc.model';
import { OpentokService } from 'app/webrtc/services/opentok.service';
import * as OT from '@opentok/client';

@Injectable()
export class WebRTCService {
  openTokInfo: any = null;

  videoCallData = new BehaviorSubject<VideoCallData>(null);
  videoCallSession = new BehaviorSubject<any>(null);
  videoCallPublisher: OT.Publisher = null;
  videoCallStream = new BehaviorSubject<any>(null);

  screenRecordingSession: any;
  dockedModeStatus = new BehaviorSubject<DockedModeStatus>({registered: false, active: false});

  constructor(
    private api: ApiService,
    private opentokService: OpentokService,
  ) {
    this.videoCallData.subscribe(callData => {
      if (callData === null && this.videoCallSession.value) {
        this.videoCallSession.value.disconnect();
        this.videoCallSession.next(null);
        this.destroyPublisher();

        this.videoCallStream.next(null);
      }
    });
  }

  getWebRTCActiveSessions(): Observable<any> {
    return this.api.get('webrtc/webrtc-active-sessions');
  }

  startVideoCall(callData) {
    if (callData.roomId) {
      this.opentokService.getSessionInfo(callData.roomId).toPromise().then(openTokInfo => {
        this.openTokInfo = openTokInfo;

        this.videoCallSession.next(OT.initSession(openTokInfo.api_key, openTokInfo.session_id));

        this.videoCallSession.value.on('streamCreated', event => {
          this.videoCallStream.next(event.stream);
        });

        this.videoCallData.next(Object.assign({}, callData, {autoStart: true}));
      });
    }
  }

  endVideoCall(callData) {
    this.opentokService.updateCallStatus(callData.roomId, 'disconnected').subscribe(() => {
      this.videoCallData.next(null);
    }, error => {
      console.error(error);
      this.videoCallData.next(null);
    });
  }

  destroyPublisher() {
    if (this.videoCallPublisher) {
      this.videoCallPublisher.destroy();
      this.videoCallPublisher = null;
    }
  }
}
