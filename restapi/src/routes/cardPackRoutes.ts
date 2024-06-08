const { check, validationResult } = require('express-validator');
import express, { Request, Response, Router } from 'express';

const cardPackRouter: Router = express.Router();

const auth = require('../middlewares/authMiddleware');

cardPackRouter.use(auth);

import {
    getCardPacks,
    getCardPack
} from '../controllers/cardPackController';


// Obtener todos los sobres de cartas
cardPackRouter.get('/', getCardPacks);

// Obtener un sobre de cartas por su ID
cardPackRouter.get('/:cardPackId', [
    check('cardPackId').isMongoId().withMessage('Invalid card pack ID format'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getCardPack);

export default cardPackRouter;