import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorChatComponent } from './creator-chat.component';

describe('CreatorChatComponent', () => {
  let component: CreatorChatComponent;
  let fixture: ComponentFixture<CreatorChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
