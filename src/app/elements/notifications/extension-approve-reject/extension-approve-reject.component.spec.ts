import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtensionApproveRejectComponent } from './extension-approve-reject.component';

describe('ExtensionApproveRejectComponent', () => {
  let component: ExtensionApproveRejectComponent;
  let fixture: ComponentFixture<ExtensionApproveRejectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtensionApproveRejectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtensionApproveRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
