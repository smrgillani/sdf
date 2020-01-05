import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { DecisionPollOption } from 'app/collaboration/models';

@Component({
  selector: 'app-decision-poll-option-source',
  templateUrl: './decision-poll-option-source.component.html',
  styleUrls: ['./decision-poll-option-source.component.scss'],
})
export class DecisionPollOptionSourceComponent implements OnInit {
  placeholderText: string;

  @Input() decisionPollOption: DecisionPollOption;
  @Output() private addOption = new EventEmitter<void>();
  @Output() private removeOption = new EventEmitter<void>();
  @Output() private typingOccurred = new EventEmitter<void>();
  @Output() private typingStarted = new EventEmitter<void>();
  @Output() private typingEnded = new EventEmitter<void>();

  ngOnInit() {
    this.placeholderText = `Option`;
  }

  addPollOption() {
    this.addOption.emit();
    this.typingOccurred.emit();
  }

  removePollOption() {
    this.removeOption.emit();
    this.typingOccurred.emit();
  }

  onTextInputKeyDown() {
    this.typingStarted.emit();
  }

  onTextInputKeyUp() {
    this.typingEnded.emit();
  }
}
