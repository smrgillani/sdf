import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousEmployeesComponent } from './previous-employees.component';

describe('PreviousEmployeesComponent', () => {
  let component: PreviousEmployeesComponent;
  let fixture: ComponentFixture<PreviousEmployeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousEmployeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
