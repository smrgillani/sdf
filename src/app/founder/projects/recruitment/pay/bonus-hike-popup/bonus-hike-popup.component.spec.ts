import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusHikePopupComponent } from './bonus-hike-popup.component';

describe('BonusHikePopupComponent', () => {
  let component: BonusHikePopupComponent;
  let fixture: ComponentFixture<BonusHikePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BonusHikePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonusHikePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
