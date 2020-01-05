import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NdaComponent } from './nda.component';

describe('NdaComponent', () => {
  let component: NdaComponent;
  let fixture: ComponentFixture<NdaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NdaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NdaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
