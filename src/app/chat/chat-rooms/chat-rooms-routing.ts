import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomsComponent } from 'app/chat/chat-rooms/rooms/rooms.component';
import { RoomComponent } from 'app/chat/chat-rooms/rooms/room/room.component';

const routes: Routes = [
  {
    path: '',
    component: RoomsComponent,
    children: [
      {
        path: ':roomId',
        component: RoomComponent,
      }],
  },
  {
    path: ':roomId',
    component: RoomComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoomsRoutingModule {
}
