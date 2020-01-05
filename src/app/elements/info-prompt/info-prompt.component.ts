import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-info-prompt',
  templateUrl: './info-prompt.component.html',
  styleUrls: ['./info-prompt.component.css']
})
export class InfoPromptComponent implements OnInit {
  @Input() id: number;
  @Input() message: string = `In the United States, a Social Security number (SSN) is a 
  nine-digit number issued to U.S. citizens, permanent residents, and temporary (working) residents.
  <br/><br/>
  The number is issued to an individual by the Social Security Administration (SSA). 
  Its primary purpose is to track individuals for Social Security purposes.`;;
  @Output() emitService = new EventEmitter();

  myHTML:string = 'Hello<br/>World';

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
