import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-internal-forum',
  templateUrl: './internal-forum.component.html',
  styleUrls: ['./internal-forum.component.scss'],
})
export class InternalForumComponent implements OnInit {
  selectedType: string;

  constructor(
    private _location: Location,
    private router: Router, private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.selectedType = 'dialogs';
  }

  goTo(link?: string) {
    if (link) {
      this.router.navigate([link], {relativeTo: this.route});
    }
  }
}
