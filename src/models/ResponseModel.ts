
interface ResponseModel {
    id: string;
    response: ResponseModel[]; // Add the responses property as an optional array of ResponseModel
    location: {
      latitude: number;
      longitude: number;
    };
    responseDate?: string;
  }

export default ResponseModel;