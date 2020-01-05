import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicChatRoomComponent } from './public-chat-room.component';

describe('PublicChatRoomComponent', () => {
  let component: PublicChatRoomComponent;
  let fixture: ComponentFixture<PublicChatRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicChatRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicChatRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
