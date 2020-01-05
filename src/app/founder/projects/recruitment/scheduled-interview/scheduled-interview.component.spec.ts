import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledInterviewComponent } from './scheduled-interview.component';

describe('ScheduledInterviewComponent', () => {
  let component: ScheduledInterviewComponent;
  let fixture: ComponentFixture<ScheduledInterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledInterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
