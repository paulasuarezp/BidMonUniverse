const { check, validationResult } = require('express-validator');
import express, { Request, Response, Router } from 'express';

const deckRouter: Router = express.Router();

const auth = require('../middlewares/authMiddleware');

deckRouter.use(auth);

import {
    getDecks,
    getDeck
} from '../controllers/deckController';

// Obtener todos los mazos de cartas
deckRouter.get('/', getDecks);

// Obtener un mazo de cartas por su ID
deckRouter.get('/:deckId', [
    check('deckId').isMongoId().withMessage('Invalid deck ID format'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getDeck);

export default deckRouter;