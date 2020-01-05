import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HireEmployeeFilterComponent } from './hire-employee-filter.component';

describe('HireEmployeeFilterComponent', () => {
  let component: HireEmployeeFilterComponent;
  let fixture: ComponentFixture<HireEmployeeFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HireEmployeeFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HireEmployeeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
