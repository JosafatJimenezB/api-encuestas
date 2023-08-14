import QuestionModel from './QuestionModel';
import ResponseModel from './ResponseModel';
interface SurveyModel {
  id: number;
  name: string;
  description: string;
  responded: boolean;
  questions: QuestionModel[];
  responses: ResponseModel[];
  location: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  responseDate: string;
}


export default SurveyModel;