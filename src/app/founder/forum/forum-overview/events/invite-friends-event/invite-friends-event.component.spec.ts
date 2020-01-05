import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteFriendsEventComponent } from './invite-friends-event.component';

describe('InviteFriendsEventComponent', () => {
  let component: InviteFriendsEventComponent;
  let fixture: ComponentFixture<InviteFriendsEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteFriendsEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteFriendsEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
