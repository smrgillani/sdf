import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferToSelfComponent } from './transfer-to-self.component';

describe('TransferToSelfComponent', () => {
  let component: TransferToSelfComponent;
  let fixture: ComponentFixture<TransferToSelfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferToSelfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferToSelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
