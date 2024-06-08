const { check, validationResult } = require('express-validator');
import express, { Request, Response, Router } from 'express';

const cardRouter: Router = express.Router();

const auth = require('../middlewares/authMiddleware');

cardRouter.use(auth);

import { 
    getCards,
    getCard
  } from '../controllers/cardController';

// Obtener todas las cartas
cardRouter.get('/', getCards);

// Obtener una carta por su ID
cardRouter.get('/:cardId', [
    check('cardId').notEmpty().withMessage('Card ID is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getCard);


export default cardRouter;