import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPromptComponent } from './info-prompt.component';

describe('InfoPromptComponent', () => {
  let component: InfoPromptComponent;
  let fixture: ComponentFixture<InfoPromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoPromptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
