import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-founder-project-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class FounderProjectNavBarComponent implements OnInit {
  isMenuExpanded = false;
  constructor() { }

  ngOnInit() {
  }

  toggleState() {
    this.isMenuExpanded = this.isMenuExpanded === false;
  }
}
