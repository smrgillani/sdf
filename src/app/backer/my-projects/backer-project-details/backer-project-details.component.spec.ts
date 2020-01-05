import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackerProjectDetailsComponent } from './backer-project-details.component';

describe('BackerProjectDetailsComponent', () => {
  let component: BackerProjectDetailsComponent;
  let fixture: ComponentFixture<BackerProjectDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackerProjectDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackerProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
