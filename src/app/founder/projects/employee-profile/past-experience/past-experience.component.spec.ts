import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastExperienceComponent } from './past-experience.component';

describe('PastExperienceComponent', () => {
  let component: PastExperienceComponent;
  let fixture: ComponentFixture<PastExperienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastExperienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
