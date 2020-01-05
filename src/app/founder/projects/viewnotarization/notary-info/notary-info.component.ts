import { Component, OnInit, Input } from '@angular/core';
import { NotarizeResponse } from '../../../../projects/models/project-notarization-model';

@Component({
  selector: 'app-notary-info',
  templateUrl: './notary-info.component.html',
  styleUrls: ['./notary-info.component.scss']
})
export class NotaryInfoComponent implements OnInit {
  @Input() notarizeResponse: NotarizeResponse;
  constructor() { }

  ngOnInit() {
  }

}
