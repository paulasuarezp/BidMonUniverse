const { check, validationResult } = require('express-validator');
import express, { Request, Response, Router } from 'express';

const transactionRouter: Router = express.Router();

const auth = require('../middlewares/authMiddleware');

transactionRouter.use(auth);

import {
    getTransactions,
    getTransaction,
    getTransactionsByCardId,
    getTransactionsByUserId,
} from '../controllers/transactionController';

// Obtener todas las transacciones
transactionRouter.get('/', getTransactions);

// Obtener una transacción por su ID
transactionRouter.get('/:transactionId', [
    check('transactionId').notEmpty().withMessage('Transaction ID is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getTransaction);


// Obtener todas las transacciones de un usuario
transactionRouter.get('/user/:username', [
    check('username').notEmpty().withMessage('Username is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getTransactionsByUserId);

// Obtener todas las transacciones de una carta
transactionRouter.get('/card/:cardId', [
    check('cardId').notEmpty().withMessage('Card ID is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getTransactionsByCardId);

export default transactionRouter;