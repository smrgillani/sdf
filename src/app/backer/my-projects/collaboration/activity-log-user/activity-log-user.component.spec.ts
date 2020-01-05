import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityLogUserComponent } from './activity-log-user.component';

describe('ActivityLogUserComponent', () => {
  let component: ActivityLogUserComponent;
  let fixture: ComponentFixture<ActivityLogUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityLogUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityLogUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
