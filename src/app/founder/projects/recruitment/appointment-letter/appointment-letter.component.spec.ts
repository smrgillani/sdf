import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentLetterComponent } from './appointment-letter.component';

describe('AppointmentLetterComponent', () => {
  let component: AppointmentLetterComponent;
  let fixture: ComponentFixture<AppointmentLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
