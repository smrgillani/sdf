import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-trading-listing',
  templateUrl: './trading-listing.component.html',
  styleUrls: ['./trading-listing.component.scss'],
})
export class TradingListingComponent {
  tradingType: string;

  constructor(
    private route: ActivatedRoute,
  ) {
    this.tradingType = this.route.snapshot.params['pagename'];
  }
}
