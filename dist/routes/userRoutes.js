"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.post('/save', userController_1.saveSurvey);
router.get('/all', userController_1.allResponses);
router.get('/get/:id', userController_1.getSurveyById);
router.post('/submit/:id', userController_1.submitResponse);
router.delete('/delete/:id', userController_1.deleteResponse);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map