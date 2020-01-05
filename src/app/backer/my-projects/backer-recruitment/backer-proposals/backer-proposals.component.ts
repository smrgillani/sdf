import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-backer-proposals',
  templateUrl: './backer-proposals.component.html',
  styleUrls: ['./backer-proposals.component.scss']
})
export class BackerProposalsComponent implements OnInit {

  @Input() projectId: number;

  constructor() { }

  ngOnInit() {
  }

}
