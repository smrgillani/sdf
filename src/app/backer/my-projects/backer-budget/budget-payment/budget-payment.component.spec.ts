import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetPaymentComponent } from './budget-payment.component';

describe('BudgetPaymentComponent', () => {
  let component: BudgetPaymentComponent;
  let fixture: ComponentFixture<BudgetPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
