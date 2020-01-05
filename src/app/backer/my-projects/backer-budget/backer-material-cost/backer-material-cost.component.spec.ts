import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackerMaterialCostComponent } from './backer-material-cost.component';

describe('BackerMaterialCostComponent', () => {
  let component: BackerMaterialCostComponent;
  let fixture: ComponentFixture<BackerMaterialCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackerMaterialCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackerMaterialCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
