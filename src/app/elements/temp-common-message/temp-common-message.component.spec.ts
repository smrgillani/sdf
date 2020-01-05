import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempCommonMessageComponent } from './temp-common-message.component';

describe('TempCommonMessageComponent', () => {
  let component: TempCommonMessageComponent;
  let fixture: ComponentFixture<TempCommonMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempCommonMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempCommonMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
