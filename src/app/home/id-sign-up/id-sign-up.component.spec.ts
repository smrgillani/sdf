import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdSignUpComponent } from './id-sign-up.component';

describe('IdSignUpComponent', () => {
  let component: IdSignUpComponent;
  let fixture: ComponentFixture<IdSignUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdSignUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
