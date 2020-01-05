import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackerActivityFeedComponent } from './backer-activity-feed.component';

describe('BackerActivityFeedComponent', () => {
  let component: BackerActivityFeedComponent;
  let fixture: ComponentFixture<BackerActivityFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackerActivityFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackerActivityFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
