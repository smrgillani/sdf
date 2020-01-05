import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackerProposalsComponent } from './backer-proposals.component';

describe('BackerProposalsComponent', () => {
  let component: BackerProposalsComponent;
  let fixture: ComponentFixture<BackerProposalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackerProposalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackerProposalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
