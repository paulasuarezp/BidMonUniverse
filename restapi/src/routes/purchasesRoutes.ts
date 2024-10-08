const { check, validationResult } = require('express-validator');
import express, { Request, Response, Router } from 'express';
import auth from '../middlewares/authMiddleware';

const purchasesRouter: Router = express.Router();

purchasesRouter.use(auth);

import {
    purchaseCardPack,
} from '../controllers/purchasesController';



/**
 * Ruta para comprar un sobre de cartas
 * @route POST /purchases/cardpack
 * @param username nombre de usuario
 * @param cardPackId id del sobre de cartas
 */
purchasesRouter.post('/cardpack', [
    check('username').notEmpty().withMessage('Username is required'),
    check('cardPackId').notEmpty().withMessage('Card Pack ID is required'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], purchaseCardPack);

export default purchasesRouter;