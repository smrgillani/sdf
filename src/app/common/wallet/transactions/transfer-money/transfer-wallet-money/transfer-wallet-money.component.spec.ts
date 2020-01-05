import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferWalletMoneyComponent } from './transfer-wallet-money.component';

describe('TransferWalletMoneyComponent', () => {
  let component: TransferWalletMoneyComponent;
  let fixture: ComponentFixture<TransferWalletMoneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferWalletMoneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferWalletMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
