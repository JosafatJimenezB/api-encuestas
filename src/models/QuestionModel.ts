interface QuestionModel {
    id: number;
    question: string;
    type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'OPEN_ENDED';
    options: string[]; // Array of options for the question
  }
export default QuestionModel;  