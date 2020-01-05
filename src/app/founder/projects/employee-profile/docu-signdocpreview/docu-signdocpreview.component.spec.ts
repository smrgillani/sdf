import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocuSigndocpreviewComponent } from './docu-signdocpreview.component';

describe('DocuSigndocpreviewComponent', () => {
  let component: DocuSigndocpreviewComponent;
  let fixture: ComponentFixture<DocuSigndocpreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocuSigndocpreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocuSigndocpreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
