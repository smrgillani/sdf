import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCompanyCompareComponent } from './search-company-compare.component';

describe('SearchCompanyCompareComponent', () => {
  let component: SearchCompanyCompareComponent;
  let fixture: ComponentFixture<SearchCompanyCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCompanyCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCompanyCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
