import {
  Component,
  Input,
  ViewEncapsulation, ViewContainerRef, ViewChild, EventEmitter, Output,
  OnInit
} from '@angular/core';
import {
  DomSanitizer
} from '@angular/platform-browser';
import {
  Observable
} from 'rxjs/Rx';

@Component({
  templateUrl: './contextmenu.component.html',
  styleUrls: ['./contextmenu.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: []
})


export class ContextMenuComponent implements OnInit {
  @Input() top: number;
  @Input() left: number;
  @Input() width: number;
  @Input() value: number;
  @Input() row: number;
  @Input() col: number;
  @Output('cutEvent') cutEvent: EventEmitter<any> = new EventEmitter();
  @Output('copyEvent') copyEvent: EventEmitter<any> = new EventEmitter();
  @Output('pasteEvent') pasteEvent: EventEmitter<any> = new EventEmitter();
  clipboard = {
    row: 0,
    col: 0,
    value: null
  };

  ngOnInit() {
    const contextmenu = document.querySelector('.contextmenu-body');
  }

  cutBtnClicked() {
    const newClipboard =  { row: this.row, col: this.col, value: this.value};
    localStorage.setItem('clipboard', JSON.stringify(newClipboard));
    this.cutEvent.emit();
  }

  copyBtnClicked() {
    const newClipboard =  { row: this.row, col: this.col, value: this.value};
    localStorage.setItem('clipboard', JSON.stringify(newClipboard));
    this.copyEvent.emit();
  }

  pasteBtnClicked() {
    const data = localStorage.getItem('clipboard');
    let prevClipboard;
    if (data !== '') { prevClipboard = JSON.parse(data);
    } else {
      prevClipboard.value = '0';
    }
    const newClipboard = { row: this.row, col: this.col, value: prevClipboard.value};
    localStorage.setItem('clipboard', JSON.stringify(newClipboard));
    this.pasteEvent.emit();
  }
}
