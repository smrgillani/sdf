import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRegistrationComponent } from './project-registration.component';

describe('ProjectRegistrationComponent', () => {
  let component: ProjectRegistrationComponent;
  let fixture: ComponentFixture<ProjectRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
