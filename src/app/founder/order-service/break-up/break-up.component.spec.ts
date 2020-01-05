import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakUpComponent } from './break-up.component';

describe('BreakUpComponent', () => {
  let component: BreakUpComponent;
  let fixture: ComponentFixture<BreakUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreakUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreakUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
