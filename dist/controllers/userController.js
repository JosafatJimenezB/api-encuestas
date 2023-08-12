"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteResponse = exports.submitResponse = exports.allResponses = exports.saveSurvey = void 0;
const awsConfig_1 = require("../utils/awsConfig");
const uuid = require('uuid');
const saveSurvey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, questions } = req.body;
        console.log(req.body);
        if (!name || !description || !questions) {
            return res.status(400).json({ message: 'Required data missing' });
        }
        const survey = {
            id: uuid.v4(),
            name: name,
            description: description,
            questions: questions.map((questionData) => ({
                id: questionData.id,
                question: questionData.question,
                type: questionData.type,
                options: questionData.options,
            })),
            responses: [], // You can initialize this array here
        };
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME || '',
            Item: survey,
        };
        yield awsConfig_1.dynamoDB.put(params).promise();
        res.status(200).json({ message: 'Data stored successfully' });
    }
    catch (error) {
        console.error('Error processing the request:', error);
        res.status(500).json({ message: 'Error processing the request' });
    }
});
exports.saveSurvey = saveSurvey;
const allResponses = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME || ''
        };
        const data = yield awsConfig_1.dynamoDB.scan(params).promise();
        const respuestas = data.Items;
        res.status(200).json(respuestas);
    }
    catch (error) {
        console.error('Error al obtener las respuestas:', error);
        res.status(500).json({ message: 'Error al obtener las respuestas' });
    }
});
exports.allResponses = allResponses;
//TODO: hacer pruebas
const submitResponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { surveyId, responses, location } = req.body;
        console.log(req.body);
        if (!surveyId || !responses || !location) {
            return res.status(400).json({ message: 'Required data missing' });
        }
        const surveyResponse = {
            id: uuid.v4(),
            surveyId: surveyId,
            responses: responses,
            location: {
                latitude: location.latitude,
                longitude: location.longitude,
            },
        };
        res.status(200).json({ message: 'Survey response saved successfully' });
    }
    catch (error) {
        console.error('Error processing the request:', error);
        res.status(500).json({ message: 'Error processing the request' });
    }
});
exports.submitResponse = submitResponse;
const deleteResponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME || '',
            Key: {
                id: id
            }
        };
        yield awsConfig_1.dynamoDB.delete(params).promise();
        res.status(200).json({ message: 'Respuesta eliminada con éxito' });
    }
    catch (error) {
        console.error('Error al eliminar la respuesta:', error);
        res.status(500).json({ message: 'Error al eliminar la respuesta' });
    }
});
exports.deleteResponse = deleteResponse;
//# sourceMappingURL=userController.js.map