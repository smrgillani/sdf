import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkRecordingsComponent } from './work-recordings.component';

describe('WorkRecordingsComponent', () => {
  let component: WorkRecordingsComponent;
  let fixture: ComponentFixture<WorkRecordingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkRecordingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkRecordingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
