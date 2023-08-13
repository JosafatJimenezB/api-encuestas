import QuestionModel from './QuestionModel';

interface CreateSurveyModel {
  id: number;
  name: string;
  description: string;
  responded: boolean;
  questions: QuestionModel[];
  createdAt: string;
}

export default CreateSurveyModel;