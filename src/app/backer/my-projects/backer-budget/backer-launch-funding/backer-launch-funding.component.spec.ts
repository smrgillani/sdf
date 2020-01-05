import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackerLaunchFundingComponent } from './backer-launch-funding.component';

describe('BackerLaunchFundingComponent', () => {
  let component: BackerLaunchFundingComponent;
  let fixture: ComponentFixture<BackerLaunchFundingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackerLaunchFundingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackerLaunchFundingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
