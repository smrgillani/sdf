import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { OrderService } from 'app/founder/order-service/services/order.service';
import { NewServiceModel } from 'app/founder/order-service/models/new-service-model';
import { ChatWebsocketService } from 'app/chat/chat-websocket/chat.websocket.service';

@Component({
  selector: 'app-creator-service-work-area',
  templateUrl: './creator-service-work-area.component.html',
  styleUrls: ['./creator-service-work-area.component.scss'],
})
export class CreatorServiceWorkAreaComponent implements OnInit, OnDestroy {
  isProcessesOpen = true;
  order: number;
  activeMobileView: null | 'chat' | 'menu' | 'documents' = 'menu';
  orderServiceInfo: NewServiceModel = new NewServiceModel();
  private project: number;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private chatWebsocketService: ChatWebsocketService,
  ) {
    this.order = parseInt(this.route.snapshot.params['orderid']);
    this.project = parseInt(this.route.snapshot.params['id']);
  }

  ngOnInit() {
    this.chatWebsocketService.createChatWebSocket();
    this.getOrderServiceInfo();
  }

  ngOnDestroy() {
    this.chatWebsocketService.destroyChatWebSocket();
  }

  private getOrderServiceInfo() {
    this.orderService.getOrderServiceInfo(this.order).subscribe((info: any) => {
      this.orderServiceInfo = info;
    });
  }
}
