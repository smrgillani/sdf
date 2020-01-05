import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubscribeNewUpgradeComponent } from './unsubscribe-new-upgrade.component';

describe('UnsubscribeNewUpgradeComponent', () => {
  let component: UnsubscribeNewUpgradeComponent;
  let fixture: ComponentFixture<UnsubscribeNewUpgradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsubscribeNewUpgradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsubscribeNewUpgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
