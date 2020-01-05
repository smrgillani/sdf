import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyJobPostingResponseComponent } from './my-job-posting-response.component';

describe('MyJobPostingResponseComponent', () => {
  let component: MyJobPostingResponseComponent;
  let fixture: ComponentFixture<MyJobPostingResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyJobPostingResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyJobPostingResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
