import ResponseModel from './ResponseModel';
interface SurveyResponseModel {
    id: number;
    surveyId: number; // ID of the survey being responded to
    responses: ResponseModel[]; // An array of ResponseModel
    location: {
      latitude: number;
      longitude: number;
    };
  }

  export default SurveyResponseModel;