import QuestionModel from './QuestionModel';
import ResponseModel from './ResponseModel';

interface SurveyModel {
  id: number;
  name: string;
  description: string;
  questions: QuestionModel[];
  responses: ResponseModel[];
  location: {
    latitude: number;
    longitude: number;
  }
  createAt: string;
  responseDate: string;
}

export default SurveyModel;