

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

export const getSurveyData = async (surveyId: string): Promise<SurveyModel> => {
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

    const surveyData: SurveyModel = data.Item as SurveyModel;

    

    return surveyData;
  } catch (error) {
    console.error('Error getting survey data:', error);
    throw error;
  }
};


export const submitResponse = async (req: Request, res: Response) => {
  try {
    const { surveyId, responses, location } = req.body;

    if (!surveyId || !responses || !location) {
      return res.status(400).json({ message: 'Required data missing' });
    }

    const existingSurvey = await getSurveyData(surveyId);



    const formattedResponses = responses.map((response: { question: any; response: any; }) => ({
      question: response.question,
      response: response.response,
    }));

    const formattedLocation = {
      latitude: location.latitude,
      longitude: location.longitude,
    };

    const newResponses = formattedResponses.map((formattedResponse: { question: any; response: any; }) => ({
      id: uuid.v4(), // Generate a unique ID for the response
      questionId: formattedResponse.question.id, // Use the question ID to match the ResponseModel
      answer: formattedResponse.response, // Use "answer" to match the ResponseModel structure
    }));

    const newResponseData = {
      id: surveyId,
      responses: newResponses,
      location: formattedLocation,
      responseDate: new Date().toISOString(), // Store the response date
    };


    existingSurvey.responses.push(...newResponses); // Push new responses into the existing responses array

    const params: DocumentClient.UpdateItemInput = {
      TableName: process.env.DYNAMODB_TABLE_NAME || '',
      Key: {
        id: surveyId,
      },
      UpdateExpression: 'SET responses = :response, #loc = :location, responded = :responded, responseDate = :responseDate', // Include responseDate
      ExpressionAttributeValues: {
        ':response': existingSurvey.responses,
        ':location': formattedLocation,
        ':responded': existingSurvey.responded,
        ':responseDate': newResponseData.responseDate,
      },
      ExpressionAttributeNames: {
        '#loc': 'location',
      },
    };

    await dynamoDB.update(params).promise();

    res.status(200).json({ message: 'Survey response saved successfully' });
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
      responded: data.Item.responded,
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


