import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkSampleComponent } from './work-sample.component';

describe('WorkSampleComponent', () => {
  let component: WorkSampleComponent;
  let fixture: ComponentFixture<WorkSampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkSampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
