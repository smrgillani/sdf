import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldingSharesComponent } from './holding-shares.component';

describe('HoldingSharesComponent', () => {
  let component: HoldingSharesComponent;
  let fixture: ComponentFixture<HoldingSharesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoldingSharesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldingSharesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
