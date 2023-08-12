import { Request, Response } from 'express';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { dynamoDB } from '../utils/awsConfig';
import SurveyResponseModel from '../models/SurveyResponseModel';
import SurveyModel from '../models/SurveyModel';
import QuestionModel from '../models/QuestionModel';
const uuid = require('uuid')

export const saveSurvey = async (req: Request, res: Response) => {
  try {
    const { name, description, questions } = req.body;

    console.log(req.body);

    if (!name || !description || !questions) {
      return res.status(400).json({ message: 'Required data missing' });
    }

    const survey: SurveyModel = {
      id: uuid.v4(),
      name: name,
      description: description,
      questions: questions.map((questionData: QuestionModel) => ({
        id: questionData.id,
        question: questionData.question,
        type: questionData.type, // Add the question type
        options: questionData.options,
      })),
      responses: [], // You can initialize this array here
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

//TODO: hacer pruebas
export const submitResponse = async (req: Request, res: Response) => {
  try {
    const { surveyId, responses, location } = req.body;

    console.log(req.body);

    if (!surveyId || !responses || !location) {
      return res.status(400).json({ message: 'Required data missing' });
    }

    const surveyResponse: SurveyResponseModel = {
      id: uuid.v4(),
      surveyId: surveyId,
      responses: responses,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    };
    //TODO: falta probar

    const params: DocumentClient.UpdateItemInput = {
      TableName: process.env.DYNAMODB_TABLE_NAME || '',
      Key: {
        id: surveyId,
      },
      UpdateExpression: 'SET responses = list_append(responses, :response)',
      ExpressionAttributeValues: {
        ':response': [surveyResponse],
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

    if (!data.Item) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    const surveyData: SurveyModel = {
      id: data.Item.id,
      name: data.Item.name,
      description: data.Item.description,
      questions: data.Item.questions,
      responses: data.Item.responses,
    };



    res.status(200).json(surveyData);
  } catch (error) {
    console.error('Error fetching survey data:', error);
    res.status(500).json({ message: 'Error fetching survey data' });
  }
};