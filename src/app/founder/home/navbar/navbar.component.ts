import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-founder-home-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class HomeNavBarComponent implements OnInit {
  private userType = 'founder';

  isMenuExpanded = false;
  constructor() { }

  ngOnInit() {
  }

  toggleState() {
    this.isMenuExpanded = this.isMenuExpanded === false;
  }
}
