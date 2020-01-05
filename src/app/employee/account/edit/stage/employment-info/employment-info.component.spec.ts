import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploymentInfoComponent } from './employment-info.component';

describe('EmploymentInfoComponent', () => {
  let component: EmploymentInfoComponent;
  let fixture: ComponentFixture<EmploymentInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmploymentInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmploymentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
