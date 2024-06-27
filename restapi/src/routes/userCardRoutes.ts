const { param, validationResult } = require('express-validator');
import express, { Request, Response, Router } from 'express';
import auth from '../middlewares/authMiddleware';

const userCardRouter: Router = express.Router();

userCardRouter.use(auth);

import {
  getUserCard,
  getUserCards
} from '../controllers/userCardController';

/**
 * Ruta para obtener todas las cartas de un usuario
 * @route GET /cards/:username
 * @param username nombre de usuario
 * @returns lista de cartas de un usuario
 * @throws 500 - Si se produce un error de conexión con la base de datos
 * @throws 400 - Si username no es un string
 */
userCardRouter.get('/u/:username', [
  param('username').notEmpty().withMessage('Username is required'),
  param('username').isString().withMessage('Username must be a string'),
  param('username').isLength({ max: 12 }).withMessage('Username must be at most 12 characters long'),
  param('username').isString().isLowercase().withMessage('Username must be a valid string in lowercase'),
  (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
], getUserCards);



/**
 * Ruta para obtener una carta de un usuario por su ID
 * @route GET /cards/:id
 * @param id id de la carta de usuario
 * @returns carta de un usuario
 * @throws 500 - Si se produce un error de conexión con la base de datos
 * @throws 400 - Si el id no es un string
 */
userCardRouter.get('/:id', [
  param('id').notEmpty().withMessage('Card ID is required'),
  param('id').isString().isMongoId().withMessage('Card ID must be a valid MongoDB ID'),
  (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
], getUserCard);




export default userCardRouter;