import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-my-shares',
  templateUrl: './my-shares.component.html',
  styleUrls: ['./my-shares.component.scss']
})
export class MySharesComponent implements OnInit {

  constructor(private _location: Location) { }

  ngOnInit() {
  }

}
