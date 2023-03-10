import { Request, Response } from 'express';
import { getCustomRepository, Not, IsNull } from 'typeorm';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

export class NpsController {

  /**
   * 
   */
  async execute(req: Request, res: Response) {
    
    const { survey_id } = req.params;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveysUsers = await surveysUsersRepository.find({
      where: {
        survey_id,
        value: Not(IsNull())
      }
    })

    const detractor = surveysUsers.filter(survey =>
      survey.value >= 0 && survey.value <= 6
    ).length

    const promoters = surveysUsers.filter(survey => survey.value >= 9).length

    const passives = surveysUsers.filter(survey =>
      survey.value >= 7 && survey.value <= 8
    ).length

    const totalAnswers = surveysUsers.length;


    const calculate = Number((((promoters - detractor) / totalAnswers) * 100).toFixed(2));


    return res.json({
      totalAnswers,
      detractor,
      promoters,
      passives,
      nps: calculate
      
    })

  }


}