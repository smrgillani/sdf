import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockAddressComponent } from './block-address.component';

describe('BlockAddressComponent', () => {
  let component: BlockAddressComponent;
  let fixture: ComponentFixture<BlockAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
