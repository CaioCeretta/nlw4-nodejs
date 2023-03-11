import { NextFunction, Request, Response } from 'express';
import { resolve } from 'path';
import { getCustomRepository } from 'typeorm';

import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import SendMailService from '../services/SendMailService';

export class SendMailController {
  async execute(req: Request, res: Response, next: NextFunction) {
    const { email, survey_id } = req.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);


    const foundUser = await usersRepository.findOne({ email })

    if (!foundUser) {
      return res.status(400).json({ error: 'User not found' });
    }

    const foundSurvey = await surveysRepository.findOne({ id: survey_id })

    if (!foundSurvey) {
      return res.status(400).json({ error: 'Survey not found' });
    }

    const variables = {
      name: foundUser.name,
      title: foundSurvey.title,
      description: foundSurvey.description,
      user_id: foundUser.id,
      link: process.env.URL_MAIL
    }

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsmail.hbs')



    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where: [{
        user_id: foundUser.id
      },
      { value: null }
      ],
      relations: ["user", "survey"] 
    });

    if(surveyUserAlreadyExists) {
      await SendMailService.execute(email, foundSurvey.title, variables, npsPath);
      return res.json(surveyUserAlreadyExists)

    }




    const surveyUser = surveysUsersRepository.create({
      user_id: foundUser.id,
      survey_id
    })

    await surveysUsersRepository.save(surveyUser);




    await SendMailService.execute(email, foundSurvey.title, variables, npsPath)

    return res.json(surveyUser);

  }

}