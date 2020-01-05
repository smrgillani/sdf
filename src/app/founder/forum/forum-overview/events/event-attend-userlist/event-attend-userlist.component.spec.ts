import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventAttendUserlistComponent } from './event-attend-userlist.component';

describe('EventAttendUserlistComponent', () => {
  let component: EventAttendUserlistComponent;
  let fixture: ComponentFixture<EventAttendUserlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventAttendUserlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventAttendUserlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
