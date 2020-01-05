import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FileDroppa } from 'file-droppa/lib/index';

import { NavbarModule } from '../../../core/navbar/navbar.module';
import { ForumOverviewComponent } from './forum-overview.component';
import { NewsComponent } from './news/news.component';
import { InternalForumComponent } from './internal-forum/internal-forum.component';
import { VideosComponent } from './videos/videos.component';
import { EventsComponent } from './events/events.component';
import { ForumDialogsComponent } from './internal-forum/forum-dialogs/forum-dialogs.component';
import { ForumTopicsComponent } from './internal-forum/forum-topics/forum-topics.component';
import { ForumPeopleComponent } from './internal-forum/forum-people/forum-people.component';
import { NewThreadComponent } from './new-thread/new-thread.component';
import { ForumService } from 'app/projects/forum.service';
import { AppElementsModule } from 'app/elements/elements.module';
import { MyPrimeNgModule } from 'app/my-prime-ng.module';
import { PreviewPeopleComponent } from './internal-forum/forum-people/preview-people/preview-people.component';
import { AppPipesModule } from 'app/pipes/pipes.module';
import { FeedService } from 'app/projects/feed.service';
import { AddEventsComponent } from './events/add-events/add-events.component';
import { EventsListComponent } from './events/events-list/events-list.component';
import { InviteFriendsEventComponent } from './events/invite-friends-event/invite-friends-event.component';
import { EventAttendUserlistComponent } from './events/event-attend-userlist/event-attend-userlist.component';
import { UpdateEventsComponent } from './events/update-events/update-events.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NavbarModule,
    FormsModule,
    MyPrimeNgModule,
    FileDroppa,
    AppPipesModule,
    AppElementsModule,
    PerfectScrollbarModule.forRoot(),
  ],
  declarations: [
    ForumOverviewComponent,
    NewsComponent,
    InternalForumComponent,
    VideosComponent,
    EventsComponent,
    ForumDialogsComponent,
    ForumTopicsComponent,
    ForumPeopleComponent,
    NewThreadComponent,
    PreviewPeopleComponent,
    AddEventsComponent,
    UpdateEventsComponent,
    EventsListComponent,
    InviteFriendsEventComponent,
    EventAttendUserlistComponent
  ],
  exports: [
    ForumOverviewComponent,
  ],
  providers: [
    ForumService,
    FeedService,
  ],
})
export class ForumOverviewModule {
}
