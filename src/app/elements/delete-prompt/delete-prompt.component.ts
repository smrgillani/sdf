import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-prompt',
  templateUrl: './delete-prompt.component.html',
  styleUrls: ['./delete-prompt.component.scss']
})
export class DeletePromptComponent implements OnInit {
  @Input() id: number;
  @Input() message: string = 'Are you sure you want to delete this item?';
  @Input() moreMessage: string = '';
  @Output() emitService = new EventEmitter();

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
   
  }

  delete() {
    this.emitService.next(true);
  }
}
