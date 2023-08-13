import express from 'express';
import { saveSurvey, allResponses, deleteResponse, getSurveyById, submitResponse } from '../controllers/userController';

const router = express.Router();

router.post('/save', saveSurvey);

router.get('/all', allResponses)
router.get('/get/:id', getSurveyById)

router.post('/submit/:id', submitResponse) 

router.delete('/delete/:id', deleteResponse)



export default router;