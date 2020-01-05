export interface Work {
  title: string;
  progress: number;
  startDate: Date;
  endDate: Date;
}

export interface WorkItemDragEvent {
  work: Work;
  type: 'startDate' | 'endDate' | 'both';
}
