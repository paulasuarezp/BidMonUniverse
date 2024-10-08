const { param, validationResult } = require('express-validator');
import express, { Request, Response, Router } from 'express';
import auth, { verifyAdmin } from '../middlewares/authMiddleware';

const transactionRouter: Router = express.Router();


transactionRouter.use(auth);

import {
    getTransactions,
    getTransactionsByUserCardId,
    getTransactionsByUsername
} from '../controllers/transactionController';

/**
 * Ruta para obtener todas las transacciones
 * @route GET /transactions
 * @returns todas las transacciones, puede ser un array vacío
 * @throws 500 - Si se produce un error de conexión con la base de datos
 */
transactionRouter.get('/', verifyAdmin, getTransactions);


/**
 * Ruta para obtener todas las transacciones de un usuario, por su username
 * @route GET /transactions/user/:username
 * @param username nombre de usuario
 * @returns todas las transacciones del usuario, puede ser un array vacío
 * @throws 400 - Si el username no es válido
 * @throws 500 - Si se produce un error de conexión con la base de datos
 */
transactionRouter.get('/u/:username', [
    param('username').notEmpty().withMessage('Username is required'),
    param('username').isString().isLowercase().withMessage('Username must be a valid string in lowercase'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getTransactionsByUsername);

/**
 * Ruta para obtener todas las transacciones de una carta, por su cardId
 * @route GET /transactions/card/:cardId
 * @param cardId id de la carta
 * @returns todas las transacciones de la carta, puede ser un array vacío
 * @throws 400 - Si el cardId no es válido
 * @throws 500 - Si se produce un error de conexión con la base de datos
 */
transactionRouter.get('/c/:userCardId', [
    param('userCardId').notEmpty().withMessage('User Card ID is required'),
    param('userCardId').isString().isMongoId().withMessage('User Card ID must be a valid MongoID'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getTransactionsByUserCardId);


export default transactionRouter;