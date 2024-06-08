const { check, validationResult } = require('express-validator');
import express, { Request, Response, Router } from 'express';

const purchasesRouter: Router = express.Router();

const auth = require('../middlewares/authMiddleware');

purchasesRouter.use(auth);

import {
    purchaseCardPack,
} from '../controllers/purchasesController';



// Comprar un sobre de cartas
purchasesRouter.post('/cardpack', [
    check('username').notEmpty().withMessage('Username is required'),
    check('cardPackId').notEmpty().withMessage('Card Pack ID is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], purchaseCardPack);

export default purchasesRouter;