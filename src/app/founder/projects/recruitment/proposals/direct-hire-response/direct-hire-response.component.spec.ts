import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectHireResponseComponent } from './direct-hire-response.component';

describe('DirectHireResponseComponent', () => {
  let component: DirectHireResponseComponent;
  let fixture: ComponentFixture<DirectHireResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectHireResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectHireResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
