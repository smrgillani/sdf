import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionPollOptionSourceComponent } from './decision-poll-option-source.component';

describe('DecisionPollOptionSourceComponent', () => {
  let component: DecisionPollOptionSourceComponent;
  let fixture: ComponentFixture<DecisionPollOptionSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecisionPollOptionSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionPollOptionSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
