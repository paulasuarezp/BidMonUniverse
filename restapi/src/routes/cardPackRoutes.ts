const { param, validationResult } = require('express-validator');
import express, { Request, Response, Router } from 'express';

const cardPackRouter: Router = express.Router();

const auth = require('../middlewares/authMiddleware');

cardPackRouter.use(auth);

import {
    getCardPacks,
    getCardPack
} from '../controllers/cardPackController';

/**
 * Ruta para obtener todos los sobres de cartas
 * @route GET /cardPacks
 */
cardPackRouter.get('/', getCardPacks);

/**
 * Ruta para obtener un sobre de cartas por su ID
 * @route GET /cardPacks/:cardPackId
 * @param cardPackId id del sobre de cartas
 */
cardPackRouter.get('/:cardPackId', [
    param('cardPackId').notEmpty().withMessage('Card Pack ID is required'),
    param('cardPackId').isString().isLength({ min: 2, max: 10}).withMessage('Card Pack ID must be a valid string with a length between 2 and 10 characters'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getCardPack);

export default cardPackRouter;