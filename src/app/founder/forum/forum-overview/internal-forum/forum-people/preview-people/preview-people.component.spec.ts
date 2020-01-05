import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewPeopleComponent } from './preview-people.component';

describe('PreviewPeopleComponent', () => {
  let component: PreviewPeopleComponent;
  let fixture: ComponentFixture<PreviewPeopleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewPeopleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
