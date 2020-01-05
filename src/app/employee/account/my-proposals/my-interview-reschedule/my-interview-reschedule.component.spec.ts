import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyInterviewRescheduleComponent } from './my-interview-reschedule.component';

describe('MyInterviewRescheduleComponent', () => {
  let component: MyInterviewRescheduleComponent;
  let fixture: ComponentFixture<MyInterviewRescheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyInterviewRescheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyInterviewRescheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
