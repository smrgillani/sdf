import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import * as OT from '@opentok/client';
import { ApiService } from 'app/core/api/api.service';

@Injectable()
export class OpentokService {
  session: OT.Session;
  token: string;

  constructor(private api: ApiService) { }

  getOT() {
    return OT;
  }

  getSessionInfo(room_id): Observable<any> {
    const body = {
      room_id: room_id,
    };
    return this.api.post('webrtc/webrtc-create-session', body);
  }

  getScreenRecordingSession(task_id): Observable<any> {
    const body = {
      task_id: task_id,
    };
    return this.api.post('webrtc/webrtc-create-recording-session', body);
  }

  updateCallStatus(room_id, callStatus): Observable<any> {
    const body = {
      room_id: room_id,
      call_status: callStatus,
    };
    console.log(`updating call status as ${body.call_status} for room id ${body.room_id}`);
    return this.api.put('webrtc/webrtc-create-session', body);
  }

  startArchive(sessionId): Observable<any> {
    const body = {
      sessionId: sessionId,
    };
    return this.api.post('webrtc/webrtc-start-archive', body);
  }

  stopArchive(archiveId): Observable<any> {
    const body = {
      archiveId: archiveId,
    };
    return this.api.post('webrtc/webrtc-stop-archive', body);
  }

  getArchiveData(taskId: number): Observable<any> {
    return this.api.get('webrtc/webrtc-get-active-session', {task_id: taskId});
  }
}
