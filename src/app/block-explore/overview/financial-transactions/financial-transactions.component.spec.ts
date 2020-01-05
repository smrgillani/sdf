import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialTransactionsComponent } from './financial-transactions.component';

describe('FinancialTransactionsComponent', () => {
  let component: FinancialTransactionsComponent;
  let fixture: ComponentFixture<FinancialTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
