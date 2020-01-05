import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventInvitationStatusComponent } from './event-invitation-status.component';

describe('EventInvitationStatusComponent', () => {
  let component: EventInvitationStatusComponent;
  let fixture: ComponentFixture<EventInvitationStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventInvitationStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventInvitationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
