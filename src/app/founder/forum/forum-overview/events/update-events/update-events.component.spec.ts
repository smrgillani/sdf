import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEventsComponent } from './update-events.component';

describe('UpdateEventsComponent', () => {
  let component: UpdateEventsComponent;
  let fixture: ComponentFixture<UpdateEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
