import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRatingComponent } from './payment-rating.component';

describe('PaymentRatingComponent', () => {
  let component: PaymentRatingComponent;
  let fixture: ComponentFixture<PaymentRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
