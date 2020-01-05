import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumTopicsComponent } from './forum-topics.component';

describe('ForumTopicsComponent', () => {
  let component: ForumTopicsComponent;
  let fixture: ComponentFixture<ForumTopicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumTopicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
