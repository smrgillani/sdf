import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackerDirectHireResponseComponent } from './backer-direct-hire-response.component';

describe('BackerDirectHireResponseComponent', () => {
  let component: BackerDirectHireResponseComponent;
  let fixture: ComponentFixture<BackerDirectHireResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackerDirectHireResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackerDirectHireResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
