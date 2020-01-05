import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalForumComponent } from './internal-forum.component';

describe('InternalForumComponent', () => {
  let component: InternalForumComponent;
  let fixture: ComponentFixture<InternalForumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalForumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
