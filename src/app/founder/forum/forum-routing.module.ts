import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForumOverviewComponent } from './forum-overview/forum-overview.component';
import { NewsComponent } from './forum-overview/news/news.component';
import { VideosComponent } from './forum-overview/videos/videos.component';
import { EventsComponent } from './forum-overview/events/events.component';
import { InternalForumComponent } from './forum-overview/internal-forum/internal-forum.component';
import { NewThreadComponent } from './forum-overview/new-thread/new-thread.component';
import { ForumDialogsComponent } from './forum-overview/internal-forum/forum-dialogs/forum-dialogs.component';
import { ForumTopicsComponent } from './forum-overview/internal-forum/forum-topics/forum-topics.component';
import { ForumPeopleComponent } from './forum-overview/internal-forum/forum-people/forum-people.component';
import { EventsListComponent } from './forum-overview/events/events-list/events-list.component';
import { AddEventsComponent } from './forum-overview/events/add-events/add-events.component';
import { UpdateEventsComponent } from './forum-overview/events/update-events/update-events.component';


const routes: Routes = [
  {
    path: '',
    component: ForumOverviewComponent,
    children: [
      {
        path: '', redirectTo: 'forum', pathMatch: 'full',
      },
      {
        path: 'forum',
        component: InternalForumComponent, // , outlet: 'document'
        children: [
          {
            path: '', redirectTo: 'dialogs', pathMatch: 'full',
            // component: ForumDialogsComponent,
          },
          {
            path: 'dialogs',
            component: ForumDialogsComponent, // , outlet: 'document'
          },
          {
            path: 'topics/:id',
            component: ForumTopicsComponent, // , outlet: 'document'
          },
          {
            path: 'topics',
            component: ForumTopicsComponent, // , outlet: 'document'
          },
          {
            path: 'people',
            component: ForumPeopleComponent, // , outlet: 'document'
          },
        ],
      },
      {
        path: 'news',
        component: NewsComponent, // , outlet: 'document'
      },
      {
        path: 'videos',
        component: VideosComponent, // , outlet: 'document'
      },
      {
        path: 'events',
        component: EventsComponent, // , outlet: 'document'
        children: [
          {
            path: '', redirectTo: 'list', pathMatch: 'full',
          },
          {
            path: 'list',
            component: EventsListComponent, // , outlet: 'document'
          },
          {
            path: 'add-event',
            component: AddEventsComponent, // , outlet: 'document'
          },
          {
            path: 'update-event',
            component: UpdateEventsComponent, // , outlet: 'document'
          },
        ],
      },
      {
        path: 'new-thread',
        component: NewThreadComponent, // , outlet: 'document'
      },
      {
        path: ':id/update-thread',
        component: NewThreadComponent, // , outlet: 'document'
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForumRoutingModule {
}
