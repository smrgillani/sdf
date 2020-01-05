import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtensionProcessComponent } from './extension-process.component';

describe('ExtensionProcessComponent', () => {
  let component: ExtensionProcessComponent;
  let fixture: ComponentFixture<ExtensionProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtensionProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtensionProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
