import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackerPreviousEmployeesComponent } from './backer-previous-employees.component';

describe('BackerPreviousEmployeesComponent', () => {
  let component: BackerPreviousEmployeesComponent;
  let fixture: ComponentFixture<BackerPreviousEmployeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackerPreviousEmployeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackerPreviousEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
