import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedMoneyListComponent } from './received-money-list.component';

describe('ReceivedMoneyListComponent', () => {
  let component: ReceivedMoneyListComponent;
  let fixture: ComponentFixture<ReceivedMoneyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivedMoneyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivedMoneyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
