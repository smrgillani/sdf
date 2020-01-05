import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { TasksService } from 'app/projects/tasks.service';
import { ExtensionProcessModel } from 'app/employee/account/collaboration/extension-process/extension-process-model';

@Component({
  selector: 'app-extension-approve-reject',
  templateUrl: './extension-approve-reject.component.html',
  styleUrls: ['./extension-approve-reject.component.scss'],
  providers: [TasksService]
})
export class ExtensionApproveRejectComponent implements OnInit {

  @Input() id: number;
  extensionInfo: ExtensionProcessModel;

  constructor(public activeModal: NgbActiveModal,
    private tasksService: TasksService) { }

  ngOnInit() {
    this.tasksService.getExtensionHour(this.id).subscribe((obj) => {
      this.extensionInfo = obj;
    });
  }

  updateExtensionStatus(status: string) {
    this.tasksService.putExtensionHour(this.id, status).subscribe((obj) => {
      this.activeModal.close();
    });
  }

}
