import { Component, OnInit,ChangeDetectorRef } from '@angular/core';

import { PROFILE_STAGES } from './../../profile.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { StageState } from '../../stageState'
import { StageStorage } from 'app/employeeprofile/stage-storage.service';
import { AccountService } from '../../../../founder/account/account.service';
import { Index as EmployeeInfo} from 'app/employeeprofile/models/index';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/merge';
//import { debug } from 'util';
import { LoaderService } from 'app/loader.service';
import { environment } from 'environments/environment';
import { JwtHelper } from 'angular2-jwt';
import { AuthService } from 'app/auth/auth.service';


@Component({
  //selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.scss']//,
  //providers:[StageStorage]
})
export class StageComponent implements OnInit {
  title: string;
  subtitle: string;
  idea: any;
  stage: string;
  previous?: string;
  next?: string;
  stageState: StageState;
  stages: any[] = PROFILE_STAGES;
  employeeInfo: EmployeeInfo = new EmployeeInfo();
  //basicInfo: EmployeeInfo.basicInfo;
  //this.employeeInfo.
  serverUrlToAppend: string = '';
  private readonly jwtHelper: JwtHelper = new JwtHelper();

  constructor(private route: ActivatedRoute, private stageStorage:StageStorage,
     private accountService: AccountService, private auth: AuthService,
     private router: Router,
     private loaderService: LoaderService, private cdRef:ChangeDetectorRef) {
    this.title = route.snapshot.data['title'];
    this.subtitle = route.snapshot.data['subtitle'];
    this.stage = route.snapshot.data['stage'];
    this.previous = route.snapshot.data['previous'];
    this.next = route.snapshot.data['next'];
    this.serverUrlToAppend = environment.server.replace('/api/v1', '');
  }

  ngOnInit() {
    this.stageStorage.getBasicInfo().subscribe((obj)=>{
      if (obj.photo && obj.photo.indexOf('https') < 0) {
        obj.photo = `${this.serverUrlToAppend}${obj.photo}`;
      }
      this.employeeInfo.basicInfo = obj;
      this.loadState();
    });
  }
  ngAfterViewChecked()
  {
    this.cdRef.detectChanges();
  }
  loadState() {
    this.stageState = this.stageStorage.getStageState(this.stage);
    this.stageState.done = true;
    /*if (this.idea) {
      this.stageStorage.loadAnswers(this.idea, 'idea').subscribe((stageState) => {
        if (stageState.stage === this.stage) {
          this.stageState = stageState;
        }
      });
    } else {
      this.stageStorage.loadStagesState();
    }*/
  }

  getUserIdFromToken() {
    const jwt = localStorage.getItem('token');
    const jwtDetails = this.jwtHelper.decodeToken(jwt);
    const userID = jwtDetails.user_id;
    return userID;
  }

  invalidToken() {
    console.log('InvalidToekn >>> Going to clear cache and Logout');
    localStorage.removeItem('currentRole');
    localStorage.removeItem('userCountry');
    localStorage.removeItem('userCountryName');
    localStorage.removeItem('keepMeLoggedIn');
    this.accountService.clearProfileCache();
    this.router.navigateByUrl('/login');

    this.accountService.signOut().subscribe(() => {
    this.auth.logout();
    });
  }
}
