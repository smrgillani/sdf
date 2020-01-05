import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadSourceComponent } from './file-upload-source.component';

describe('FileUploadSourceComponent', () => {
  let component: FileUploadSourceComponent;
  let fixture: ComponentFixture<FileUploadSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileUploadSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
