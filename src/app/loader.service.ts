import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Message } from 'primeng/primeng';

@Injectable()
export class LoaderService {
  loaderStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  growlMessage: BehaviorSubject<Message> = new BehaviorSubject<Message>(null);
}
