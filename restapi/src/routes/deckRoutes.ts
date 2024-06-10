const { check, param, validationResult } = require('express-validator');
import express, { Request, Response, Router } from 'express';
import  auth  from '../middlewares/authMiddleware';

const deckRouter: Router = express.Router();


deckRouter.use(auth);

import {
    getDecks,
    getDeck
} from '../controllers/deckController';

/**
 * Ruta para obtener todos los mazos de cartas
 * @route GET /decks
 * @returns lista de mazos de cartas
 * @throws 500 - Si se produce un error de conexión con la base de datos
 */
deckRouter.get('/', getDecks);

/**
 * Ruta para obtener un mazo de cartas por su ID
 * @route GET /decks/:deckId
 * @param deckId id del mazo de cartas
 * @returns mazo de cartas
 * @throws 404 - Si no se encuentra el mazo de cartas
 * @throws 500 - Si se produce un error de conexión con la base de datos
 * @throws 400 - Si deckId no es un string
 */
deckRouter.get('/:deckId', [
    param('deckId').notEmpty().withMessage('Deck ID is required'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getDeck);

export default deckRouter;