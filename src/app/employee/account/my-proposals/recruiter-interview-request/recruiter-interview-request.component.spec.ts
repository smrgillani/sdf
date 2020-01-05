import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterInterviewRequestComponent } from './recruiter-interview-request.component';

describe('RecruiterInterviewRequestComponent', () => {
  let component: RecruiterInterviewRequestComponent;
  let fixture: ComponentFixture<RecruiterInterviewRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruiterInterviewRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruiterInterviewRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
