export type mcqQuestion = {
    question: string;
    answer: string;
    option1: string;
    option2: string;
    option3: string;
};

export type oeQuestion = {
    question: string;
    answer: string;
};

export type tfQuestion = {
    question: string;
    answer: boolean;
};

export enum GAME_TYPE {
    MULTIPLE_CHOICE = "multiple_choice",
    OPEN_ENDED = "open_ended",
    TRUE_FALSE = "true_false",
}