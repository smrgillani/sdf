import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceExtensionComponent } from './service-extension.component';

describe('ServiceExtensionComponent', () => {
  let component: ServiceExtensionComponent;
  let fixture: ComponentFixture<ServiceExtensionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceExtensionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
