import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumPeopleComponent } from './forum-people.component';

describe('ForumPeopleComponent', () => {
  let component: ForumPeopleComponent;
  let fixture: ComponentFixture<ForumPeopleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumPeopleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
