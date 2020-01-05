import { Component, OnInit, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { OpentokService } from 'app/webrtc/services/opentok.service';
import { WebRTCService } from 'app/common/services/webRTC.service';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs/Subscription';
import * as OT from '@opentok/client';

@Component({
  selector: 'app-webrtc-main',
  templateUrl: './web-rtc-main.component.html',
  styleUrls: ['./web-rtc-main.component.scss'],
})
export class WebRtcMainComponent implements OnInit, AfterViewInit, OnDestroy {
  isCallStarted = false;
  isScreenShareStart = false;
  isRecordingStart = false;
  private ffWhitelistVersion: any;
  private archiveData: any;
  private screenSharingPublisher: any;
  private subscriptions: Subscription[] = [];

  @Input() callData: { roomId: string, autoStart: boolean, incomingMessage: string };

  constructor(
    private opentokService: OpentokService,
    private webRTCService: WebRTCService,
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.webRTCService.videoCallSession.subscribe(session => {
        if (session) {
          this.initializeCall(session);
        }
      }),
    );
  }

  ngAfterViewInit() {
    if (this.callData.autoStart) {
      this.startCall();
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  startCall() {
    this.isCallStarted = true;
    this.webRTCService.startVideoCall(this.callData);
  }

  endCall() {
    this.isCallStarted = false;
    this.webRTCService.endVideoCall(this.callData);
  }

  startScreenShare() {
    this.screenshare();
  }

  stopScreenShare() {
    this.isScreenShareStart = false;
  }

  startRecording() {
    const self = this;

    this.opentokService.startArchive(this.webRTCService.videoCallSession.value.id).subscribe(data => {
      self.archiveData = data;
      self.isRecordingStart = true;
    });
  }

  stopRecording() {
    if (this.archiveData) {
      this.opentokService.stopArchive(this.archiveData.id).subscribe();
      this.archiveData = null;
      this.isRecordingStart = false;
    }
  }

  private initializeCall(session) {
    this.webRTCService.videoCallStream
      .filter(stream => stream !== null)
      .take(1)
      .subscribe(stream => {
        if (stream.videoType === 'screen') {
          // This is a screen-sharing stream published by another client
          const subOptions = {
            width: stream.videoDimensions.width / 2,
            height: stream.videoDimensions.height / 2,
          };
          session.subscribe(stream, 'screen-subscriber', subOptions);
        } else {
          // This is a stream published by another client using the camera and microphone
          session.subscribe(stream, 'subscriber');
        }
      });

    this.webRTCService.destroyPublisher();

    // Create a publisher
    this.webRTCService.videoCallPublisher = OT.initPublisher('publisher', {
      insertMode: 'append',
      // width: '100%',
      // height: '100%',
      showControls: true,
      publishAudio: true,
      publishVideo: true,
    }, this.handleError);

    if (session.currentState === 'disconnected') {
      // Connect to the session
      session.connect(this.webRTCService.openTokInfo.token, error => {
        // If the connection is successful, publish to the session
        if (error) {
          this.handleError(error);
        } else {
          session.publish(this.webRTCService.videoCallPublisher, this.handleError);
        }
      });

      // For Google Chrome only, register your extension by ID,
      // You can find it at chrome://extensions once the extension is installed
      OT.registerScreenSharingExtension('chrome', environment.chromeExtensionId, 2);

      this.opentokService.updateCallStatus(this.callData.roomId, 'joined').subscribe();
    }
  }

  // Handling all of our errors here by alerting them
  private handleError(error) {
    if (error) {
      console.log(error.message);
    }
  }

  private screenshare() {
    OT.checkScreenSharingCapability(response => {
      if (!response.supported || response.extensionRegistered === false) {
        alert('This browser does not support screen sharing.');
      } else if (response.extensionInstalled === false
        && (response.extensionRequired || !this.ffWhitelistVersion)) {
        alert('Please install the screen-sharing extension and load this page over HTTPS.');
      } else if (this.ffWhitelistVersion && navigator.userAgent.match(/Firefox/)
        && navigator.userAgent.match(/Firefox\/(\d+)/)[1] < this.ffWhitelistVersion) {
        alert('For screen sharing, please update your version of Firefox to '
          + this.ffWhitelistVersion + '.');
      } else {
        // Screen sharing is available. Publish the screen.
        // Create an element, but do not display it in the HTML DOM:
        const screenPublisherElement = document.createElement('div');

        this.screenSharingPublisher = OT.initPublisher(
          screenPublisherElement,
          {videoSource: 'screen'},
          error => {
            if (error) {
              alert('Something went wrong: ' + error.message);
            } else {
              this.webRTCService.videoCallSession.value.publish(
                this.screenSharingPublisher,
                error2 => {
                  if (error2) {
                    alert('Something went wrong: ' + error2.message);
                  }
                }).on('streamCreated', () => {
                this.isScreenShareStart = false;
              }).on('streamDestroyed', () => {
                this.webRTCService.videoCallSession.value.unpublish(this.screenSharingPublisher);
                this.isScreenShareStart = false;
              });
            }
          });
      }
    });
  }
}
