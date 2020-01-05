import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackerEmployeeProfileComponent } from './backer-employee-profile.component';

describe('BackerEmployeeProfileComponent', () => {
  let component: BackerEmployeeProfileComponent;
  let fixture: ComponentFixture<BackerEmployeeProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackerEmployeeProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackerEmployeeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
