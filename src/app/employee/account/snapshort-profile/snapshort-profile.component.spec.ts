import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnapshortProfileComponent } from './snapshort-profile.component';

describe('SnapshortProfileComponent', () => {
  let component: SnapshortProfileComponent;
  let fixture: ComponentFixture<SnapshortProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnapshortProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnapshortProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
