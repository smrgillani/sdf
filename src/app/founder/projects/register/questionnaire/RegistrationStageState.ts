import RegistrationAnswer from './models/RegistrationAnswer';


export default class RegistrationStageState {
  stage: string;
  projectId?: number;
  answers: RegistrationAnswer[] = [];
  nextQuestion?: number;
  done: Boolean = false;
}