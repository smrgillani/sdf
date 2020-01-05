import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-founder-idea-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class IdeaNavBarComponent implements OnInit {
  isMenuExpanded = false;

  constructor() { }

  ngOnInit() {
  }

  toggleState() {
    this.isMenuExpanded = this.isMenuExpanded === false;
  }
}
