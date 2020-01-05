import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectregisteredComponent } from './projectregistered.component';

describe('ProjectregisteredComponent', () => {
  let component: ProjectregisteredComponent;
  let fixture: ComponentFixture<ProjectregisteredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectregisteredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectregisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
