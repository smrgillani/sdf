import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignedDocumentsComponent } from './signed-documents.component';

describe('SignedDocumentsComponent', () => {
  let component: SignedDocumentsComponent;
  let fixture: ComponentFixture<SignedDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignedDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignedDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
