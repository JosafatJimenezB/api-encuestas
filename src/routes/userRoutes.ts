import express from 'express';
import { saveSurvey, allResponses, deleteResponse, getSurveyById } from '../controllers/userController';

const router = express.Router();

router.post('/save', saveSurvey);

router.get('/all', allResponses)
router.get('/get/:id', getSurveyById)

router.delete('/delete/:id', deleteResponse)



export default router;