import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateSlabComponent } from './rate-slab.component';

describe('RateSlabComponent', () => {
  let component: RateSlabComponent;
  let fixture: ComponentFixture<RateSlabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateSlabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateSlabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
