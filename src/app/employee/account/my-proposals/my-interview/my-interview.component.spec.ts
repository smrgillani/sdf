import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyInterviewComponent } from './my-interview.component';

describe('MyInterviewComponent', () => {
  let component: MyInterviewComponent;
  let fixture: ComponentFixture<MyInterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyInterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
