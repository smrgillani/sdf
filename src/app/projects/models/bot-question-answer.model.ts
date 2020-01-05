export class BotQuestionAnswer {
    constructor() {
        this.questionInfo = new BotQuestionInfo();
        this.answerInfo = new BotAnswerInfo();
        this.questionInfoList = [];
        this.answerInfoList = [];
    }
    id: number;
    questionInfo: BotQuestionInfo;
    answerInfo: BotAnswerInfo;
    questionInfoList: BotQuestionInfo[];
    answerInfoList: BotAnswerInfo[];
}

export class BotQuestionInfo {
    creator?: number;
    id: number;
    is_active: boolean;
    project?: number;
    question_type: string;
    title: string;
    isAnswered: boolean;
    index: number;
}

export class BotAnswerInfo {
    question: number;
    title: string;
    question_type: string;
    project?: number;
    task?: number;
    response_text: string;
    boolean_text?: boolean;
    no_days?: number;
    user?: number;
    index: number;
}
