import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RescheduledInterviewComponent } from './rescheduled-interview.component';

describe('RescheduledInterviewComponent', () => {
  let component: RescheduledInterviewComponent;
  let fixture: ComponentFixture<RescheduledInterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RescheduledInterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RescheduledInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
