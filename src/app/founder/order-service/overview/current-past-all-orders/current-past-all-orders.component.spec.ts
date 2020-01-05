import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentPastAllOrdersComponent } from './current-past-all-orders.component';

describe('CurrentPastAllOrdersComponent', () => {
  let component: CurrentPastAllOrdersComponent;
  let fixture: ComponentFixture<CurrentPastAllOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentPastAllOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentPastAllOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
