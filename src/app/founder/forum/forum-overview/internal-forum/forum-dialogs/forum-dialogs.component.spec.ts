import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumDialogsComponent } from './forum-dialogs.component';

describe('ForumDialogsComponent', () => {
  let component: ForumDialogsComponent;
  let fixture: ComponentFixture<ForumDialogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumDialogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumDialogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
