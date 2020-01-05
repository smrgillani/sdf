import Answer from './models/Answer';


export default class StageState {
  stage: string;
  projectId?: number;
  answers: Answer[] = [];
  nextQuestion?: number;
  done: Boolean = false;
}
