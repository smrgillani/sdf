import { Component, OnInit, Input } from "@angular/core";
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from "rxjs";

import {TasksService} from 'app/projects/tasks.service';

@Component({
    templateUrl: './stop-timer.component.html',
    styleUrls: ['./stop-timer.component.scss']
})
export class StopTimerComponent implements OnInit {

    @Input() hours: number;
    @Input() mins: number;
    @Input() activeSessionId: number;

    constructor(public activeModal: NgbActiveModal,private tasksService: TasksService,) {

    }

    ngOnInit() {
        console.log(`hours = ${this.hours}, mins = ${this.mins}`);
    }

    stopTimer() {
        let loggedIn_Hours = `${this.hours}:${this.mins}`
        this.tasksService.stopActiveWorkSession(this.activeSessionId, loggedIn_Hours).subscribe((data) => {
            this.activeModal.close('timer saved');
        }, (error) => {
            this.activeModal.dismiss(error);
        });
    }

}