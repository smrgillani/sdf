import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-work-recordings',
  templateUrl: './work-recordings.component.html',
  styleUrls: ['./work-recordings.component.scss']
})
export class WorkRecordingsComponent implements OnInit {

  constructor(private _location: Location) { }

  ngOnInit() {
  }

}
