import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMoneyListComponent } from './send-money-list.component';

describe('SendMoneyListComponent', () => {
  let component: SendMoneyListComponent;
  let fixture: ComponentFixture<SendMoneyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendMoneyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMoneyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
