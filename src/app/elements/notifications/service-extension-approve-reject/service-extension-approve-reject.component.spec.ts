import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceExtensionApproveRejectComponent } from './service-extension-approve-reject.component';

describe('ServiceExtensionApproveRejectComponent', () => {
  let component: ServiceExtensionApproveRejectComponent;
  let fixture: ComponentFixture<ServiceExtensionApproveRejectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceExtensionApproveRejectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceExtensionApproveRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
