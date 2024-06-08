const { check, validationResult } = require('express-validator');
import express, { Request, Response, Router } from 'express';

const cardRouter: Router = express.Router();

const auth = require('../middlewares/authMiddleware');

cardRouter.use(auth);

import { 
    getCards,
    getCard,
    updateCardReferences
  } from '../controllers/cardController';

/**
 * Ruta para obtener todas las cartas
 * @route GET /cards
 */
cardRouter.get('/', getCards);

cardRouter.get('/updateCardReferences', updateCardReferences);


/**
 * Ruta para obtener una carta por su ID
 * @route GET /cards/:cardId
 * @param cardId id de la carta
 */
cardRouter.get('/:cardId', [
    check('cardId').notEmpty().withMessage('Card ID is required'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getCard);




export default cardRouter;