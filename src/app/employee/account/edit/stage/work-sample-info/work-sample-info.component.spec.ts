import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkSampleInfoComponent } from './work-sample-info.component';

describe('WorkSampleInfoComponent', () => {
  let component: WorkSampleInfoComponent;
  let fixture: ComponentFixture<WorkSampleInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkSampleInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkSampleInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
