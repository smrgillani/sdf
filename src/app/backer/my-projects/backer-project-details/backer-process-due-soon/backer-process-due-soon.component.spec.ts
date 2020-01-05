import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackerProcessDueSoonComponent } from './backer-process-due-soon.component';

describe('BackerProcessDueSoonComponent', () => {
  let component: BackerProcessDueSoonComponent;
  let fixture: ComponentFixture<BackerProcessDueSoonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackerProcessDueSoonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackerProcessDueSoonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
