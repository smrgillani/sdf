import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEmployeeComponent } from './my-employee.component';

describe('MyEmployeeComponent', () => {
  let component: MyEmployeeComponent;
  let fixture: ComponentFixture<MyEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
