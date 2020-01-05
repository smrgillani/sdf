import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

import { ChatService } from 'app/collaboration/chat.service';
import { ChatWebsocketService } from 'app/chat/chat-websocket/chat.websocket.service';
import { AccountService } from 'app/founder/account/account.service';
import { flatMap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
})
export class RoomsComponent implements OnInit, OnDestroy {
  roomList: any[];
  roomUnreads: _.Dictionary<number>;
  isLeftMenuOpened = false;
  isNewChatOpened = false;
  searchText = '';
  private selectedRoomId: string;
  private subscriptions: Subscription[] = [];

  constructor(
    private chatService: ChatService,
    private chatWebsocketService: ChatWebsocketService,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.sortRooms = this.sortRooms.bind(this);
  }

  ngOnInit() {
    this.chatService.clearProfileCache();
    this.chatWebsocketService.createChatWebSocket();

    this.fetchRoomList();
    this.roomUnreads = this.accountService.messagesCountersSubject.value.rooms_details;
    this.subscriptions.push(this.accountService.messagesCountersSubject.subscribe(val => {
      this.roomUnreads = val.rooms_details;
      if (this.roomList) {
        this.roomList.sort(this.sortRooms);
      }
    }));
  }

  ngOnDestroy() {
    this.chatWebsocketService.destroyChatWebSocket();

    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  selectUser(id: string) {
    this.chatService.getChatUser(id).pipe(
      flatMap(result => this.chatService.postDirectRoom(null, result.id)),
    )
      .subscribe(result => {
        const data = result.json();

        this.isNewChatOpened = false;
        this.fetchRoomList();
        this.selectRoom(data['room']['_id']);
      });
  }

  selectRoom(id: string) {
    this.selectedRoomId = id;
    this.isNewChatOpened = false;
    this.router.navigate(['./', id], {relativeTo: this.route.parent});
  }

  toggleLeftMenu() {
    this.isLeftMenuOpened = !this.isLeftMenuOpened;
  }

  getActiveClass(item) {
    return item._id === this.selectedRoomId;
  }

  private fetchRoomList() {
    this.chatService.getAllChatRooms().subscribe(rooms => {
      console.log('roomList:', rooms);
      this.roomList = rooms.sort(this.sortRooms);
    });
  }

  private sortRooms(item1, item2) {
    if (this.roomUnreads[item1._id] !== undefined && this.roomUnreads[item1._id] > 0) {
      if (this.roomUnreads[item2._id] !== undefined && this.roomUnreads[item2._id] > 0) {
        return item1.room_name >= item2.room_name ? 1 : -1;
      } else {
        return -1;
      }
    } else {
      if (this.roomUnreads[item2._id] !== undefined && this.roomUnreads[item2._id] > 0) {
        return 1;
      } else {
        return item1.room_name >= item2.room_name ? 1 : -1;
      }
    }
  }
}
