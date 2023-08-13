import ResponseModel from './ResponseModel';
interface SurveyResponseModel {

    responses: ResponseModel[]; // An array of ResponseModel
    location: {
      latitude: number;
      longitude: number;
    };
  }

  export default SurveyResponseModel;