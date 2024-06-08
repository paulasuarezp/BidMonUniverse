const { check, validationResult } = require('express-validator');
import express, { Request, Response, Router } from 'express';

const cardRouter: Router = express.Router();

const auth = require('../middlewares/authMiddleware');

cardRouter.use(auth);

import {
    getUserCards,
    getUserCard,
    addNewUserCard
  } from '../controllers/userCardController';
  
/**
 * Ruta para obtener todas las cartas de un usuario
 * @route GET /cards/:username
 * @param username nombre de usuario
 * @returns lista de cartas de un usuario
 * @throws 500 - Si se produce un error de conexión con la base de datos
 * @throws 400 - Si username no es un string
 */
cardRouter.get('/:username', [
    check('username').notEmpty().withMessage('Username is required'),
    check('username').isString().withMessage('Username must be a string'),
    check('username').isLength({ max: 12 }).withMessage('Username must be at most 12 characters long'),
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
 * @route GET /cards/:username/:cardId
 * @param username nombre de usuario
 * @param cardId id de la carta
 * @returns carta de un usuario
 * @throws 500 - Si se produce un error de conexión con la base de datos
 * @throws 400 - Si username o cardId no son strings válidos
 */
cardRouter.get('/:username/:cardId', [
  check('username').notEmpty().withMessage('Username is required'),
  check('username').isString().withMessage('Username must be a string'),
  check('username').isLength({ max: 12 }).withMessage('Username must be at most 12 characters long'),
  check('cardId').notEmpty().withMessage('Card ID is required'),
  check('cardId').isString().withMessage('Card ID must be a string'),
  (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
], getUserCard);


/**
 * Ruta para añadir una carta a un usuario
 * @route POST /cards/add
 * @param username nombre de usuario
 * @param cardId id de la carta
 * 
 * @returns carta añadida
 * @throws 500 - Si se produce un error de conexión con la base de datos
 * @throws 400 - Si username o cardId no son strings válidos
 */
cardRouter.post('/add', [
    check('username').notEmpty().withMessage('Username is required'),
    check('cardId').notEmpty().withMessage('Card ID is required'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], addNewUserCard);


export default cardRouter;