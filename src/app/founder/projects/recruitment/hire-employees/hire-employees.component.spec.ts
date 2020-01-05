import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HireEmployeesComponent } from './hire-employees.component';

describe('HireEmployeesComponent', () => {
  let component: HireEmployeesComponent;
  let fixture: ComponentFixture<HireEmployeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HireEmployeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HireEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
