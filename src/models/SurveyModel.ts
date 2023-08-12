import QuestionModel from './QuestionModel';
import ResponseModel from './ResponseModel';

interface SurveyModel {
  id: number;
  name: string;
  description: string;
  questions: QuestionModel[];
  responses: ResponseModel[];
}

export default SurveyModel;