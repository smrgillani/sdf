import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { environment } from 'environments/environment';

@Injectable()
export class WebSocketService {
  activeParticipants: number[] = [];
  private socket: Subject<any>;
  private participantsSource = new Subject<any>();
  participants$ = this.participantsSource.asObservable();

  connect(urlPath): Subject<any> {
    if (!this.socket) {
      const jwt = localStorage.getItem('token');
      this.socket = this.create(`${environment.webSocketURL}${urlPath}?token=${jwt}`);
    }
    return this.socket;
  }

  updateActiveParticipants(userID: number, action: string) {
    if (action === 'add' && !this.activeParticipants.includes(userID)) {
      this.activeParticipants.push(userID);
    } else if (action === 'remove' && this.activeParticipants.includes(userID)) {
      this.activeParticipants = this.activeParticipants.filter(id => id !== userID);
    }
    this.participantsSource.next(this.activeParticipants);
  }

  checkConnected() {
    return (this.socket ? true : false);
  }

  private create(url): Subject<any> {
    const ws = new WebSocket(url);

    const observable = Observable.create(
      (obs: Observer<any>) => {
        ws.onmessage = obs.next.bind(obs);
        ws.onerror = obs.error.bind(obs);
        ws.onclose = obs.complete.bind(obs);
        // return ws.onopen = (evt)=>{
        //     ws.send("yakko.... ");}
        return ws.close.bind(ws);
        // return ws;
      },
    );

    const observer = {
      next: (data: any) => {
        if (ws.readyState === WebSocket.OPEN) {
          // ws.send(JSON.stringify(data));
          if (data === '$closecon$') {
            this.socket = null;
            this.activeParticipants = [];
            ws.close();
          } else {
            ws.send(data);
          }
        }
      },
    };

    return Subject.create(observer, observable);
  }
}
