import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forum-overview',
  templateUrl: './forum-overview.component.html',
  styleUrls: ['./forum-overview.component.scss'],
})
export class ForumOverviewComponent implements OnInit {
  currentStage = '';
  buttons: any[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.buttons = [
      {caption: 'News', color: '#fe5f5b', icon: 'icon-newspaper-folded', link: 'news'},
      {caption: 'Forum', color: '#fe5f5b', icon: 'icon-discuss-issue', link: 'forum'},
      {caption: 'Videos', color: '#fe5f5b', icon: 'icon-video-player', link: 'videos'},
      {caption: 'Events', color: '#fe5f5b', icon: 'icon-event', link: 'events'},
    ];


    let href = this.router.url.split('/').pop();

    if (href === 'list') {
      this.currentStage = 'events';
    } else if (href === 'dialogs') {
      this.currentStage = 'forum';
    } else {
      this.currentStage = href;
    } 
  }

  getIcon(icon: string): string {
    return `/assets/img/project/${icon}`;
  }

  goTo(link?: string) {
    if (link) {
      this.currentStage = link;
      this.router.navigate([link], {relativeTo: this.route});
      // this.router.navigate(['dashboard',{ outlets: {document: [link]} }], {relativeTo: this.route});
    }
  }

  public toggleButtons(show: boolean) {
    // var blueTheme = document.getElementById('blue-theme');
    // var menuItems = document.getElementById('employee-menuitems');
    // var content = document.querySelector('forum-content');

    // if (show == true) {
    //   menuItems.style.display = 'block';
    //   blueTheme.style.backgroundSize = '100% 140px';

    // } else {
    //   menuItems.style.display = 'none';
    //   blueTheme.style.backgroundSize = '100% 70px';
    // }
  }
}
