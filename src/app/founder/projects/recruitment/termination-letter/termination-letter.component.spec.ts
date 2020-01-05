import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminationLetterComponent } from './termination-letter.component';

describe('TerminationLetterComponent', () => {
  let component: TerminationLetterComponent;
  let fixture: ComponentFixture<TerminationLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminationLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminationLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
