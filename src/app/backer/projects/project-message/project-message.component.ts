import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-project-message',
  templateUrl: './project-message.component.html',
  styleUrls: ['./project-message.component.scss']
})
export class ProjectMessageComponent implements OnInit {

  constructor(
    private _location: Location
  ) { }

  ngOnInit() {
  }

}
