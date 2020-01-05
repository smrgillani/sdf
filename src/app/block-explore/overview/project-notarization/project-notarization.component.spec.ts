import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectNotarizationComponent } from './project-notarization.component';

describe('ProjectNotarizationComponent', () => {
  let component: ProjectNotarizationComponent;
  let fixture: ComponentFixture<ProjectNotarizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectNotarizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectNotarizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
