import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusHikeRejectStatusComponent } from './bonus-hike-reject-status.component';

describe('BonusHikeRejectStatusComponent', () => {
  let component: BonusHikeRejectStatusComponent;
  let fixture: ComponentFixture<BonusHikeRejectStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BonusHikeRejectStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonusHikeRejectStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
