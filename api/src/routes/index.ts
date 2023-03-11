import { Router } from 'express';
import { SendMailController } from '../Controllers/SendMailController';
import { SurveysController } from '../Controllers/SurveysController';
import { UserController } from '../Controllers/UsersController';

const router = Router();

const userController = new UserController();
const surveysController = new SurveysController();

const sendMailController = new SendMailController();

router.post('/users', userController.create);

router.post('/surveys', surveysController.create);

router.get('/surveys', surveysController.list);

router.post('/sendMail', sendMailController.execute)


export default router;