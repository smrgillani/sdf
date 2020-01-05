import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessesWorkedOnComponent } from './processes-worked-on.component';

describe('ProcessesWorkedOnComponent', () => {
  let component: ProcessesWorkedOnComponent;
  let fixture: ComponentFixture<ProcessesWorkedOnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessesWorkedOnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessesWorkedOnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
