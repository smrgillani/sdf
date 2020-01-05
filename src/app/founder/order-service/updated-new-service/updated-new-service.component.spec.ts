import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedNewServiceComponent } from './updated-new-service.component';

describe('UpdatedNewServiceComponent', () => {
  let component: UpdatedNewServiceComponent;
  let fixture: ComponentFixture<UpdatedNewServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatedNewServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatedNewServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
