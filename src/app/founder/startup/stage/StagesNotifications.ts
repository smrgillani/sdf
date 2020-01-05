import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {StageStorage} from 'app/questionnaire/StageStorage';
import {STARTUP_STAGES} from '../startup.constants';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class StageNotifications {
  projectId?: number;
  activeStageName: string;
  uncompletedStage: string;
  popoverTimerList = {};
  nextStage: any[] = STARTUP_STAGES;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private stateStorage: StageStorage) {
    this.activeStageName = route.snapshot.data['stage'];
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
    });
  };

  closePopoverpWithDelay(timer: number, popoverId: NgbPopover, timerName) {
    clearTimeout(this.popoverTimerList[timerName]);
    this.popoverTimerList[timerName] = setTimeout(() => {
      popoverId.close();
    }, timer);
  }

  chaeckStageCompletion(newStage:any, newStageIndex: number): Observable<any> {
    let prevStageName = newStageIndex !== 0 ? this.nextStage[newStageIndex - 1].url : this.nextStage[newStageIndex].url;
    let activeStage = this.stateStorage.getStageState(this.activeStageName, this.projectId);
    let prevStage = this.stateStorage.getStageState(prevStageName, this.projectId);
    let newStageObj = this.stateStorage.getStageState(newStage.url, this.projectId);

    return Observable.create((observer) => {
      //user on IDEA REALISATION page
      if (!this.activeStageName) {
        if (newStageIndex === 0 || prevStage.done) {
            observer.next(newStage);
        } else {
          this.uncompletedStage = prevStageName;
          return observer.error(this.uncompletedStage);
        }
      }

      if (this.activeStageName !== newStage.url) {
        if (newStageIndex === 0 || newStageObj.done || (activeStage.done && prevStage.done)) {
            observer.next(newStage);
        } else {
          this.uncompletedStage = !activeStage.done ? activeStage.stage : prevStageName;
           observer.error(this.uncompletedStage);
        }
      }
      observer.complete();
    });
  }

  navigateTo(menu: any) {
    if (menu.enabled) {
      this.router.navigate([menu.url], {relativeTo: this.route.parent});
    }
  }
}
