import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackerMyEmployeeComponent } from './backer-my-employee.component';

describe('BackerMyEmployeeComponent', () => {
  let component: BackerMyEmployeeComponent;
  let fixture: ComponentFixture<BackerMyEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackerMyEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackerMyEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
