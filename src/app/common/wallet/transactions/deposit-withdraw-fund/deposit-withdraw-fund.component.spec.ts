import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositWithdrawFundComponent } from './deposit-withdraw-fund.component';

describe('DepositWithdrawFundComponent', () => {
  let component: DepositWithdrawFundComponent;
  let fixture: ComponentFixture<DepositWithdrawFundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositWithdrawFundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositWithdrawFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
