import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-docu-signdocpreview',
  templateUrl: './docu-signdocpreview.component.html',
  styleUrls: ['./docu-signdocpreview.component.scss']
})
export class DocuSigndocpreviewComponent implements OnInit {

  @Input() URL;
  @Input() isPopup: boolean = false;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }
}
