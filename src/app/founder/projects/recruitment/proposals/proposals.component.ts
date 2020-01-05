import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.css']
})
export class ProposalsComponent implements OnInit {

@Input() projectId: number;

  constructor() { }

  ngOnInit() {
  }

}
