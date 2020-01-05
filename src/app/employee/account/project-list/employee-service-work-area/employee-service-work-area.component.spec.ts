import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeServiceWorkAreaComponent } from './employee-service-work-area.component';

describe('EmployeeServiceWorkAreaComponent', () => {
  let component: EmployeeServiceWorkAreaComponent;
  let fixture: ComponentFixture<EmployeeServiceWorkAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeServiceWorkAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeServiceWorkAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
