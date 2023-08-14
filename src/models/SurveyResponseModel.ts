import ResponseModel from './ResponseModel';

interface SurveyResponseModel {
  responses: ResponseModel[];
  location: {
    latitude: number;
    longitude: number;
  };
  responseDate: string;
}

export default SurveyResponseModel;