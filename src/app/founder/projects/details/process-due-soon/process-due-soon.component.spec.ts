import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessDueSoonComponent } from './process-due-soon.component';

describe('ProcessDueSoonComponent', () => {
  let component: ProcessDueSoonComponent;
  let fixture: ComponentFixture<ProcessDueSoonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessDueSoonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessDueSoonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
