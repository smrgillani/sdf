import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-work-sample',
  templateUrl: './work-sample.component.html',
  styleUrls: ['./work-sample.component.scss']
})
export class WorkSampleComponent implements OnInit {
  @Input() worksampleInfo;
  constructor() { }

  ngOnInit() {

  }

}
