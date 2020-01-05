import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { OpentokService } from 'app/webrtc/services/opentok.service';
import { environment } from 'environments/environment';
import { WebRTCService } from 'app/common/services/webRTC.service';
import { MetricesService } from '../../../../../projects/metrices.service';
import { TimeUtils } from '../../../../../utils/time-utils';

declare const mouseflow: any;

declare const require: any;
const OT = require('@opentok/client');

@Component({
  selector: 'app-screen-recording',
  templateUrl: './screen-recording.component.html',
  styleUrls: ['./screen-recording.component.css'],
})
export class ScreenRecordingComponent implements OnChanges, OnDestroy {
  ffWhitelistVersion: any;
  session: any;

  @Input() taskId: string;
  archiveData: any;
  session_start = false;

  constructor(
    private opentokService: OpentokService,
    private webRTCService: WebRTCService,
    private metricesService: MetricesService,
  ) { }

  ngOnChanges(changes: any): void {
    if (changes.taskId && changes.taskId.currentValue && changes.taskId.currentValue !== changes.taskId.previousValue) {
      if (mouseflow.isRecording()) {
       // window._mfq.push(['stop']);
      }
      mouseflow.stopSession();
      mouseflow.start();
      window._mfq.push(['setVariable', 'project-id', '' + TimeUtils.PROJECT_ID]);
      window._mfq.push(['setVariable', 'task-id', '' + this.taskId]);

      window._mfq.push(function(mf) {
        const mouseFlowSessionId = mf.getSessionId();
        this.setWorkSession(mouseFlowSessionId);
      }.bind(this));
      this.getArchiveData();
    }
  }

  ngOnDestroy(): void {
    // window._mfq.push(['stop']);
    mouseflow.stopSession();
  }

  screenRecording() {
    this.initWebRTC();
  }

  disableShare() {
    return this.taskId == null;
  }

  async initWebRTC() {
    if (this.taskId) {
      const openTokInfo = await this.opentokService.getScreenRecordingSession(this.taskId).toPromise();
      console.log(`screen recording session info`, openTokInfo);
      this.opentokService.startArchive(openTokInfo.session_id).subscribe((data) => {
        console.log('start archive', data);
      });
      this.initializeSession(openTokInfo.api_key, openTokInfo.session_id, openTokInfo.token);
    }
  }

  initializeSession(apiKey, sessionId, token) {
    const self = this;
    self.session = OT.initSession(apiKey, sessionId);

    // // Subscribe to a newly created stream
    // self.session.on('streamCreated', function (event) {
    //     if (event.stream.videoType === 'screen') {
    //         // This is a screen-sharing stream published by another client
    //         console.log(`screen sharing started 1`);
    //         var subOptions = {
    //             width: event.stream.videoDimensions.width / 2,
    //             height: event.stream.videoDimensions.height / 2
    //         };
    //         // self.session.subscribe(event.stream, 'screen-subscriber', subOptions);
    //     } else {
    //         // This is a stream published by another client using the camera and microphone
    //         console.log(`screen sharing started 1`);
    //         // self.session.subscribe(event.stream, 'subscriber');
    //     }
    // });

    // // Create a publisher
    // var publisher = OT.initPublisher('publisher', {
    //     // insertMode: 'append',
    //     // width: '100%',
    //     // height: '100%'
    //     publishAudio:false, publishVideo:false
    // }, self.handleError);

    // Connect to the session
    self.session.connect(token, function (error) {
      // If the connection is successful, publish to the session
      if (error) {
        self.handleError(error);
      } else {
        self.screenshare();
      }
    });

    console.log('trying to register extension');
    // For Google Chrome only, register your extension by ID,
    // You can find it at chrome://extensions once the extension is installed
    OT.registerScreenSharingExtension('chrome', environment.chromeExtensionId, 2);
    console.log('register extension done');
  }

  // Handling all of our errors here by alerting them
  handleError(error) {
    if (error) {
      console.log(error.message);
    }
  }

  stopArchive() {
    console.log(`archive data`, this.archiveData);
    const self = this;
    if (this.archiveData) {
      this.opentokService.stopArchive(this.archiveData.id).subscribe((obj) => {
        console.log(obj);
        // self.archiveData = undefined;
        self.session.disconnect();
        self.archiveData = null;
      }, error => {
        console.log(error);
        self.session.disconnect();
        self.archiveData = null;
      });
    }
  }

  screenshare() {
    console.log('screen share initiated');
    const self = this;
    OT.checkScreenSharingCapability(function (response) {
      if (!response.supported || response.extensionRegistered === false) {
        alert('This browser does not support screen sharing.');
      } else if (response.extensionInstalled === false
        && (response.extensionRequired || !self.ffWhitelistVersion)) {
        alert('Please install the screen-sharing extension and load this page over HTTPS.');
      } else if (self.ffWhitelistVersion && navigator.userAgent.match(/Firefox/)
        && navigator.userAgent.match(/Firefox\/(\d+)/)[1] < self.ffWhitelistVersion) {
        alert('For screen sharing, please update your version of Firefox to '
          + self.ffWhitelistVersion + '.');
      } else {
        // Screen sharing is available. Publish the screen.
        // Create an element, but do not display it in the HTML DOM:
        const screenPublisherElement = document.createElement('div');
        const screenSharingPublisher = OT.initPublisher(
          screenPublisherElement,
          {videoSource: 'application'},
          function (error) {
            if (error) {
              alert('Something went wrong: ' + error.message);
            } else {
              self.webRTCService.screenRecordingSession = self.session.publish(
                screenSharingPublisher,
                function (error2) {
                  if (error2) {
                    alert('Something went wrong: ' + error2.message);
                  }
                }).on('streamCreated', function (event) {
                console.log('screen sharing started.', self.session);
                self.opentokService.startArchive(self.session.id).subscribe((data) => {
                  console.log('start archive', data);
                  self.archiveData = data;
                });
              }).on('streamDestroyed', function (event) {
                console.log('stream destroyed, stopped sharing 2', event);
                self.stopArchive();
              });
            }
          });
      }
    });
  }


  setWorkSession(recordingId: any) {
    if (this.taskId) {
      this.metricesService.getMouseFlowSessionStart(recordingId, parseInt(this.taskId)).subscribe((obj) => {
        console.log(obj);
      });
    }
  }


  getArchiveData() {
    if (this.taskId) {
      this.opentokService.getArchiveData(parseInt(this.taskId)).subscribe((obj) => {
        console.log(obj);
        if (obj.session_start !== undefined) {
          this.session_start = !obj.session_start;
        } else {
          if (!obj.id && obj.archive_id === '') {
            this.archiveData = undefined;
          } else {
            this.archiveData = obj;
          }
          console.log('archive id>>>>>>>>>>>>.', this.archiveData);
          this.session_start = true;
          const getData = this.webRTCService.screenRecordingSession;
          if (getData) {
            this.session = getData;
          }
        }
      });
    }
  }
}
