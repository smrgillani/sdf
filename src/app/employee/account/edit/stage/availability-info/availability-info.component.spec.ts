import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityInfoComponent } from './availability-info.component';

describe('AvailabilityInfoComponent', () => {
  let component: AvailabilityInfoComponent;
  let fixture: ComponentFixture<AvailabilityInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailabilityInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilityInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
