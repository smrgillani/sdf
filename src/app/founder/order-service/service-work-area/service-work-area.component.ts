import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-service-work-area',
  templateUrl: './service-work-area.component.html',
  styleUrls: ['./service-work-area.component.scss']
})
export class ServiceWorkAreaComponent implements OnInit {

  isProcessesOpen = true;
  project: number;
  activeMobileView: null | 'chat' | 'menu' | 'documents';
  
  constructor(private route: ActivatedRoute) {
    this.activeMobileView = 'menu';
    this.project = parseInt(this.route.snapshot.params["id"]);
   }

  ngOnInit() {
  }

}
