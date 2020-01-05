import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackerManageFundingComponent } from './backer-manage-funding.component';

describe('BackerManageFundingComponent', () => {
  let component: BackerManageFundingComponent;
  let fixture: ComponentFixture<BackerManageFundingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackerManageFundingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackerManageFundingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
