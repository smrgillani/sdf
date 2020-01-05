import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkedOnComponent } from './worked-on.component';

describe('WorkedOnComponent', () => {
  let component: WorkedOnComponent;
  let fixture: ComponentFixture<WorkedOnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkedOnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkedOnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
