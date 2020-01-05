import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ApiService } from 'app/core/api/api.service';
import { FirebaseMessaging } from '@firebase/messaging-types';


/**
 * CFM service
 * Use for push notifications
 */
@Injectable()
export class MessagingService {
  messaging: FirebaseMessaging;
  currentMessage = new BehaviorSubject(null);

  constructor(
    private afAuth: AngularFireAuth,
    private api: ApiService,
  ) {
    this.messaging = firebase.messaging();
  }

  updateToken(token) {
    this.afAuth.authState.subscribe((user) => { });

    if (!localStorage.getItem('fcm_token') || localStorage.getItem('fcm_token') !== token) {
      localStorage.setItem('fcm_token', token);
      this.api.post(
        `devices`,
        {'registration_id': token, 'type': 'web'},
      ).subscribe();
    }
  }

  getPermission() {
    if ('serviceWorker' in navigator && typeof (PushManager) !== 'undefined') {
      this.messaging.requestPermission()
      .then(() => {
        // Notification permission granted
        console.log('getPermission Notification permission granted');
        var token = this.messaging.getToken();
        return token;
      })
      .then((token) => {
        console.log('getPermission updateToken');
        this.updateToken(token);
      })
      .catch((err) => {
        console.log('firebase error',err);
        // Unable to get permission to notify.
      });
    } else {
      console.log('getPermission here instead');
    }
  }

  receiveMessage() {
    // this.messaging.onMessage((payload) => {
    //   console.log("new message received. ", payload);
    //   this.currentMessage.next(payload)
    // });
  }

  show () {
    var streamer = 'Streamer';
    var quote = 'Quote';
    var test = new Notification(quote, {
      icon: 'assets/600x600.png',
      body: streamer + ' is live!'
    });
    test.onclick = function(){
        window.open('http://example.com');
        window.focus();
    };
  }
}
