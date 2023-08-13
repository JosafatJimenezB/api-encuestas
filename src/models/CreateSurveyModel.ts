import QuestionModel from './QuestionModel';

interface CreateSurveyModel {
  id: number;
  name: string;
  description: string;
  questions: QuestionModel[];
}

export default CreateSurveyModel;