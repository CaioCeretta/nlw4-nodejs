import { Router } from 'express';
import { NpsController } from '../Controllers/NpsController';
import { SendMailController } from '../Controllers/SendMailController';
import { SurveysController } from '../Controllers/SurveysController';
import { UserController } from '../Controllers/UsersController';
import { AnswerController } from '../Controllers/AnswerController';

const router = Router();

const userController = new UserController();
const surveysController = new SurveysController();

const sendMailController = new SendMailController();
const answerController = new AnswerController();
const npsController = new NpsController();

router.post('/users', userController.create);

router.post('/surveys', surveysController.create);

router.get('/surveys', surveysController.list);

router.post('/sendMail', sendMailController.execute)

router.get('/answers/:value', answerController.execute)

router.get('/nps/:survey_id', npsController.execute);



export default router;