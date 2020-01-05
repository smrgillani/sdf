import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanDynamicComponent } from './kanban-dynamic.component';

describe('KanbanDynamicComponent', () => {
  let component: KanbanDynamicComponent;
  let fixture: ComponentFixture<KanbanDynamicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KanbanDynamicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
