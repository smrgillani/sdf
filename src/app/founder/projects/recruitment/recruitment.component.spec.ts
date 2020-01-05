import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FounderProjectRecruitmentComponent } from './recruitment.component';

describe('FounderProjectRecruitmentComponent', () => {
  let component: FounderProjectRecruitmentComponent;
  let fixture: ComponentFixture<FounderProjectRecruitmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FounderProjectRecruitmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FounderProjectRecruitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
