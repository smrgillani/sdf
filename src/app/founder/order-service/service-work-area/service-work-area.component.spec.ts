import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceWorkAreaComponent } from './service-work-area.component';

describe('ServiceWorkAreaComponent', () => {
  let component: ServiceWorkAreaComponent;
  let fixture: ComponentFixture<ServiceWorkAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceWorkAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceWorkAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
