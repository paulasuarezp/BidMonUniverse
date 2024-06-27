const { param, validationResult } = require('express-validator');
import express, { Router } from 'express';
import auth from '../middlewares/authMiddleware';

const cardPackRouter: Router = express.Router();

cardPackRouter.use(auth);

import {
    getCardPacks
} from '../controllers/cardPackController';

/**
 * Ruta para obtener todos los sobres de cartas
 * @route GET /
 */
cardPackRouter.get('/', getCardPacks);

export default cardPackRouter;