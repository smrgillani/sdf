import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestPayComponent } from './interest-pay.component';

describe('InterestPayComponent', () => {
  let component: InterestPayComponent;
  let fixture: ComponentFixture<InterestPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
