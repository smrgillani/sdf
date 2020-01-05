import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GanttChartWorkItemComponent} from './work-item.component';
import {Work} from '../interfaces';


describe('GanttChartWorkItemComponent', () => {
  let component: GanttChartWorkItemComponent;
  let fixture: ComponentFixture<GanttChartWorkItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GanttChartWorkItemComponent]
    });

    fixture = TestBed.createComponent(GanttChartWorkItemComponent);
    component = fixture.componentInstance;
    component.work = {
      title: 'Test',
      progress: 0,
      startDate: new Date(),
      endDate: new Date()
    } as Work;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
