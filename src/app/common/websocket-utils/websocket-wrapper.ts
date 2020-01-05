import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

export class WebsocketWrapper {
  protected socket: Subject<any>;
  protected ws: WebSocket;

  constructor(url: string) {
    this.ws = new WebSocket(url);

    this.socket = new Subject();

    this.ws.onmessage = this.socket.next.bind(this.socket);
    this.ws.onerror = this.socket.error.bind(this.socket);
    this.ws.onclose = this.socket.complete.bind(this.socket);
  }

  next(value: any) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(value));
    } else if (this.ws.readyState === WebSocket.CONNECTING) {
      setTimeout(() => {
        this.next(value);
      }, 100);
    }
  }

  subscribe(next: any): Subscription {
    return this.socket.subscribe(next);
  }

  close() {
    this.ws.close();
    this.ws = null;

    this.socket.complete();
    this.socket = null;
  }
}
