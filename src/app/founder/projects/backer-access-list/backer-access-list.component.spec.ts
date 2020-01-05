import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackerAccessListComponent } from './backer-access-list.component';

describe('BackerAccessListComponent', () => {
  let component: BackerAccessListComponent;
  let fixture: ComponentFixture<BackerAccessListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackerAccessListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackerAccessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
