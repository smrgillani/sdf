import { Component, OnInit } from '@angular/core';
import { FeedService } from 'app/projects/feed.service';
import FeedEntryModel from 'app/projects/models/FeedEntryModel';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  
  // private feedUrl: string = 'https%3A%2F%2Fwww.becompany.ch%2Fen%2Fblog%2Ffeed.xml';
  // private feedUrl: string = 'http://feeds.reuters.com/reuters/businessNews';
  private feedUrl: string = 'http://feeds.feedburner.com/TechCrunch/startups';
  private feeds: FeedEntryModel[];

  expandIndex:number = -1;

  constructor(private feedService: FeedService) { }

  ngOnInit() {
    // setInterval(()=>{
    //   this.refreshFeed();
    // },1000*60);
    this.refreshFeed();
  }

  refreshFeed() {
    this.feedService.getFeedContent(this.feedUrl)
        .subscribe(
            (feed) => {
              this.feeds = feed.items;
              console.log(`this.feeds`);
              console.log(this.feeds);
            },
            error => console.log(error));
  }

}
