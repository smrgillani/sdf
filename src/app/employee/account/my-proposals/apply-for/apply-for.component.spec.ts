import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyForComponent } from './apply-for.component';

describe('ApplyForComponent', () => {
  let component: ApplyForComponent;
  let fixture: ComponentFixture<ApplyForComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyForComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyForComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
