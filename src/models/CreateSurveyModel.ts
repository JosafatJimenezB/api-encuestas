import QuestionModel from './QuestionModel';

interface CreateSurveyModel {
  id: number;
  name: string;
  description: string;
  questions: QuestionModel[];
  createdAt: string;
}

export default CreateSurveyModel;