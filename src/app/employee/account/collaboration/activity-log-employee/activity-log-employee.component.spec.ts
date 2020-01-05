import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityLogEmployeeComponent } from './activity-log-employee.component';

describe('ActivityLogEmployeeComponent', () => {
  let component: ActivityLogEmployeeComponent;
  let fixture: ComponentFixture<ActivityLogEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityLogEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityLogEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
