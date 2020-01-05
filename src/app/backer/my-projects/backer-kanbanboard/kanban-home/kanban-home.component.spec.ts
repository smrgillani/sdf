import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanHomeComponent } from './kanban-home.component';

describe('KanbanHomeComponent', () => {
  let component: KanbanHomeComponent;
  let fixture: ComponentFixture<KanbanHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KanbanHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
