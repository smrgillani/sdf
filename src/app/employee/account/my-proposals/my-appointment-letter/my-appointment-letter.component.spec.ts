import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAppointmentLetterComponent } from './my-appointment-letter.component';

describe('MyAppointmentLetterComponent', () => {
  let component: MyAppointmentLetterComponent;
  let fixture: ComponentFixture<MyAppointmentLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAppointmentLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAppointmentLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
