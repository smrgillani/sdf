import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdLoginComponent } from './id-login.component';

describe('IdLoginComponent', () => {
  let component: IdLoginComponent;
  let fixture: ComponentFixture<IdLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
