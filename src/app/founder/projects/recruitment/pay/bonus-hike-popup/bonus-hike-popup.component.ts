import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PaymentService } from 'app/projects/payment.service';
import { BonusRequestInfo, HikeRequestInfo } from 'app/employeeprofile/models/project-creator-info.model';

@Component({
  selector: 'app-bonus-hike-popup',
  templateUrl: './bonus-hike-popup.component.html',
  styleUrls: ['./bonus-hike-popup.component.scss']
})
export class BonusHikePopupComponent implements OnInit {

  @Input() type: string;
  @Input() user_id: number;
  @Input() selectedBonusOrHike: number[] = [];
  @Output() emitService = new EventEmitter();
  
  bonusRequestInfoList: BonusRequestInfo[];
  hikeRequestInfoList: HikeRequestInfo[];

  constructor(private paymentService: PaymentService) { }

  ngOnInit() {
    this.paymentService.getEmployeeBonusOrHike(this.type.toLowerCase(), this.user_id).subscribe((infoList)=>{
      this.type == 'Bonus' ? this.bonusRequestInfoList = infoList : this.hikeRequestInfoList = infoList;
      if (this.bonusRequestInfoList && this.selectedBonusOrHike) {
        this.bonusRequestInfoList.forEach((element)=>{
          if(this.selectedBonusOrHike.findIndex(a=> a == element.id) != -1) {
            element.selected = true;
          }
        });
      }
      else if (this.hikeRequestInfoList && this.selectedBonusOrHike) {
        this.hikeRequestInfoList.forEach((element)=>{
          if(this.selectedBonusOrHike.findIndex(a=> a == element.id) != -1) {
            element.selected = true;
          }
        });
      }
    });
  }

  onDone() {
    let sumAmount = this.type == 'Bonus' ? this.bonusRequestInfoList.filter(a=> a.selected == true).map(b=>b.bonus.amount).reduce((sum, current) => sum + current) 
    : this.hikeRequestInfoList.filter(a=> a.selected == true).map(b=>b.hike.amount).reduce((sum, current) => sum + current);

    this.emitService.next({type: this.type, sumAmount: sumAmount});
  }

}
