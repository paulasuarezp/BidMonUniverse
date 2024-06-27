const { param, validationResult } = require('express-validator');
import express, { Request, Response, Router } from 'express';
import auth from '../middlewares/authMiddleware';

const cardRouter: Router = express.Router();

cardRouter.use(auth);

import {
    getCard
} from '../controllers/cardController';

/**
 * Ruta para obtener una carta por su ID
 * @route GET /cards/:cardId
 * @param cardId id de la carta
 */
cardRouter.get('/:cardId', [
    param('cardId').notEmpty().withMessage('Card ID is required'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getCard);

export default cardRouter;