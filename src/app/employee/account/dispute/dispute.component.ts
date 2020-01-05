import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from 'app/app.animations';
import {NgbModal, NgbActiveModal,ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dispute',
  templateUrl: './dispute.component.html',
  styleUrls: ['./dispute.component.scss']
})
export class DisputeComponent implements OnInit {
  isshow:boolean=false;
  disbledformodify:boolean=false;
  disbledforreject:boolean=false;
  acceptdisplay:boolean=false;
  closeResult: string;
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }



  modifydispute(confirmpopup){
    this.disbledformodify=true;
    this.disbledforreject=false;
    
    this.modalService.open(confirmpopup,{
      windowClass:'interviewmodel modal-dialog-centered modifypopup'
    }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }
  rejectdispute(confirmpopup){
    this.disbledformodify=false;
    this.disbledforreject=true;

    this.modalService.open(confirmpopup,{
      windowClass:'interviewmodel modal-dialog-centered rejectpopup'
    }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  acceptdispute(confirmpopup){
    this.acceptdisplay=true;
    this.disbledformodify=false;
    this.disbledforreject=false;

    this.modalService.open(confirmpopup,{
      windowClass:'interviewmodel modal-dialog-centered acceptpopup'
    }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
