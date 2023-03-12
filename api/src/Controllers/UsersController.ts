import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as Yup from 'yup';
import { AppError } from '../errors/AppError';

export class UserController {

  async create(req: Request, res: Response) {
    const { name, email } = req.body;

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required()
    })

    // if(!(await schema.isValid(req.body))) {
    //   return res.status(400).json({error: 'Validation failed.'})
    // }

    try {
      await schema.validate(req.body)
    } catch (err) {
      throw new AppError(err)

    }

    const usersRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await usersRepository.findOne({ email })

    if (userAlreadyExists) {
      throw new AppError('User already exists')
    }

    const user = usersRepository.create({
      name,
      email
    })

    await usersRepository.save(user);

    return res.status(201).json(user);
  }


}