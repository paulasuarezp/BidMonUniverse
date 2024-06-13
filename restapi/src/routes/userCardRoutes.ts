const { check, param, validationResult } = require('express-validator');
import express, { Request, Response, Router } from 'express';
import auth from '../middlewares/authMiddleware';

const userCardRouter: Router = express.Router();


userCardRouter.use(auth);

import {
  getUserCards,
  getUserCard,
  getCardsOfUser
} from '../controllers/userCardController';

/**
 * Ruta para obtener todas las cartas de un usuario
 * @route GET /cards/:username
 * @param username nombre de usuario
 * @returns lista de cartas de un usuario
 * @throws 500 - Si se produce un error de conexión con la base de datos
 * @throws 400 - Si username no es un string
 */
userCardRouter.get('/:username', [
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
 * Ruta para obtener todas las cartas de un usuario
 * @route GET /usercards/:username/cards
 * @param username nombre de usuario
 * @returns lista de cartas de un usuario
 * @throws 500 - Si se produce un error de conexión con la base de datos
 * @throws 400 - Si username no es un string
 */
userCardRouter.get('/:username/cards', [
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
], getCardsOfUser);


/**
 * Ruta para obtener una carta de un usuario por su ID
 * @route GET /cards/:username/:cardId
 * @param username nombre de usuario
 * @param cardId id de la carta
 * @returns carta de un usuario
 * @throws 500 - Si se produce un error de conexión con la base de datos
 * @throws 400 - Si username o cardId no son strings válidos
 */
userCardRouter.get('/:username/:cardId', [
  param('username').notEmpty().withMessage('Username is required'),
  param('username').isString().withMessage('Username must be a string'),
  param('username').isLength({ max: 12 }).withMessage('Username must be at most 12 characters long'),
  param('username').isLowercase().withMessage('Username must be a valid string in lowercase'),
  param('cardId').notEmpty().withMessage('Card ID is required'),
  param('cardId').isString().withMessage('Card ID must be a string'),
  (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
], getUserCard);



export default userCardRouter;