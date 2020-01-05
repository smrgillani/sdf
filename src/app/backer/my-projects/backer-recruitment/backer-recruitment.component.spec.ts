import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackerRecruitmentComponent } from './backer-recruitment.component';

describe('BackerRecruitmentComponent', () => {
  let component: BackerRecruitmentComponent;
  let fixture: ComponentFixture<BackerRecruitmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackerRecruitmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackerRecruitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
