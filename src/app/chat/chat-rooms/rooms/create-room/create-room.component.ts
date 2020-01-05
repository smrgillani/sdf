import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RocketChatUserInfo } from 'app/collaboration/models';
import { ChatService } from 'app/collaboration/chat.service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
})
export class CreateRoomComponent implements OnInit {
  userList: RocketChatUserInfo[];
  searchText = '';

  @Output() roomSelected = new EventEmitter<string>();

  constructor(
    private chatService: ChatService,
  ) {
  }

  ngOnInit() {
    this.chatService.reloadUsersList().subscribe(users => {
      this.userList = users;
    });
  }
}
