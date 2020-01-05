import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityLogBotComponent } from './activity-log-bot.component';

describe('ActivityLogBotComponent', () => {
  let component: ActivityLogBotComponent;
  let fixture: ComponentFixture<ActivityLogBotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityLogBotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityLogBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
