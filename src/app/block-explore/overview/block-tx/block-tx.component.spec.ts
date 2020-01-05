import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockTxComponent } from './block-tx.component';

describe('BlockTxComponent', () => {
  let component: BlockTxComponent;
  let fixture: ComponentFixture<BlockTxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockTxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockTxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
