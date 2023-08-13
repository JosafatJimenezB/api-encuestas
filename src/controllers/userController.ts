import { Request, Response } from 'express';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { dynamoDB } from '../utils/awsConfig';
import CreateSurveyModel from '../models/CreateSurveyModel';
import QuestionModel from '../models/QuestionModel';
import SurveyModel from '../models/SurveyModel';
const uuid = require('uuid')

export const saveSurvey = async (req: Request, res: Response) => {
  try {
    const { name, description, questions } = req.body;

    console.log(req.body);

    if (!name || !description || !questions) {
      return res.status(400).json({ message: 'Required data missing' });
    }

    const survey: CreateSurveyModel = {
      id: uuid.v4(),
      name: name,
      description: description,
      responded: false,
      questions: questions.map((questionData: QuestionModel) => ({
        id: questionData.id,
        question: questionData.question,
        type: questionData.type, // Add the question type
        options: questionData.options,
      })),
     createdAt: new Date().toISOString() 
    };

    const params: DocumentClient.PutItemInput = {
      TableName: process.env.DYNAMODB_TABLE_NAME || '',
      Item: survey,
    };

    await dynamoDB.put(params).promise();

    res.status(200).json({ message: 'Data stored successfully' });
  } catch (error) {
    console.error('Error processing the request:', error);
    res.status(500).json({ message: 'Error processing the request' });
  }
};

export const allResponses = async (_req: Request, res: Response) => {
  try {
    const params: DocumentClient.ScanInput = {
      TableName: process.env.DYNAMODB_TABLE_NAME || ''
    };

    const data = await dynamoDB.scan(params).promise();
    const respuestas = data.Items;

    res.status(200).json(respuestas);
  } catch (error) {
    console.error('Error al obtener las respuestas:', error);
    res.status(500).json({ message: 'Error al obtener las respuestas' });
  }
};

export const getSurveyData = async (surveyId: string): Promise<CreateSurveyModel> => {
  try {
    const params: DocumentClient.GetItemInput = {
      TableName: process.env.DYNAMODB_TABLE_NAME || '',
      Key: {
        id: surveyId,
      },
    };

    const data = await dynamoDB.get(params).promise();

    if (!data.Item) {
      throw new Error('Survey not found');
    }

    const surveyData: CreateSurveyModel = data.Item as CreateSurveyModel;

    return surveyData;
  } catch (error) {
    console.error('Error getting survey data:', error);
    throw error;
  }
};



export const submitResponse = async (req: Request, res: Response) => {
  try {
    const { surveyId, responses, location } = req.body;

    console.log(req.body);

    if (!surveyId || !responses || !location) {
      return res.status(400).json({ message: 'Required data missing' });
    }

    const existingSurvey = await getSurveyData(surveyId);

    if(!existingSurvey.responded) {
      return res.status(403).json({ message: 'Survey already responded' });
    }

    existingSurvey.responded = true;

    const formattedResponses = responses.map((response: { question: any; response: any; }) => ({
      question: response.question,
      response: response.response,
    }));

    const formattedLocation = {
      latitude: location.latitude,
      longitude: location.longitude,
    };

    const surveyData = await getSurveyData(surveyId);

    const surveyResponse = {
      id: surveyId,
      name: surveyData.name,
      description: surveyData.description,
      questions: surveyData.questions,
      responses: formattedResponses,
      location: formattedLocation,
      responseDate: new Date().toISOString(),
    };

    console.log("submit ", surveyResponse);

    const params: DocumentClient.UpdateItemInput = {
      TableName: process.env.DYNAMODB_TABLE_NAME || '',
      Key: {
        id: surveyId,
      },
      UpdateExpression: 'SET responses = :response, #loc = :location, responseDate = :responseDate',
      ExpressionAttributeValues: {
        ':response': formattedResponses,
        ':location': formattedLocation,
        ':responseDate': surveyResponse.responseDate,
      },
      ExpressionAttributeNames: {
        '#loc': 'location',
      },
    };
    await dynamoDB.update(params).promise();

    res.status(200).json(surveyResponse);
  } catch (error) {
    console.error('Error processing the request:', error);
    res.status(500).json({ message: 'Error processing the request' });
  }
};

export const deleteResponse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
 
    const params: DocumentClient.DeleteItemInput = {
      TableName: process.env.DYNAMODB_TABLE_NAME || '',
      Key: {
        id: id
      }
    };

    await dynamoDB.delete(params).promise();

    res.status(200).json({ message: 'Respuesta eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la respuesta:', error);
    res.status(500).json({ message: 'Error al eliminar la respuesta' });
  }
  
};




export const getSurveyById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    console.log(id);

    const params: DocumentClient.GetItemInput = {
      TableName: process.env.DYNAMODB_TABLE_NAME || '',
      Key: {
        id: id
      },
    };

    const data = await dynamoDB.get(params).promise();

    console.log('info', data);

    if (!data.Item) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    const surveyData: SurveyModel = {
      id: data.Item.id,
      name: data.Item.name,
      description: data.Item.description,
      questions: data.Item.questions,
      responses: data.Item.responses,
      location: data.Item.location,
      createAt: data.Item.createdAt,
      responseDate: data.Item.responseDate
    };
    
    console.log(surveyData);


    res.status(200).json(surveyData);
  } catch (error) {
    console.error('Error fetching survey data:', error);
    res.status(500).json({ message: 'Error fetching survey data' });
  }
};


