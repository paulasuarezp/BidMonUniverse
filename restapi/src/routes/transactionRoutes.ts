const { param, validationResult } = require('express-validator');
import express, { Request, Response, Router } from 'express';

const transactionRouter: Router = express.Router();

const auth = require('../middlewares/authMiddleware');

transactionRouter.use(auth);

import {
    getTransactions,
    getTransaction,
    getTransactionsByCardId,
    getTransactionsByUserId,
    getTransactionsByCardIdAndUsername
} from '../controllers/transactionController';

/**
 * Ruta para obtener todas las transacciones
 * @route GET /transactions
 * @returns todas las transacciones, puede ser un array vacío
 * @throws 500 - Si se produce un error de conexión con la base de datos
 */
transactionRouter.get('/', getTransactions);

/**
 * Ruta para obtener una transacción por su ID
 * @route GET /transactions/:transactionId
 * @param transactionId id de la transacción
 * @returns la transacción
 * @throws 400 - Si el transactionId no es válido
 * @throws 404 - Si no se encuentra la transacción
 * @throws 500 - Si se produce un error de conexión con la base de datos
 */
transactionRouter.get('/:transactionId', [
    param('transactionId').notEmpty().withMessage('Transaction ID is required'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getTransaction);


/**
 * Ruta para obtener todas las transacciones de un usuario, por su username
 * @route GET /transactions/user/:username
 * @param username nombre de usuario
 * @returns todas las transacciones del usuario, puede ser un array vacío
 * @throws 400 - Si el username no es válido
 * @throws 500 - Si se produce un error de conexión con la base de datos
 */
transactionRouter.get('/user/:username', [
    param('username').notEmpty().withMessage('Username is required'),
    param('username').isString().isLowercase().withMessage('Username must be a valid string in lowercase'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getTransactionsByUserId);

/**
 * Ruta para obtener todas las transacciones de una carta, por su cardId
 * @route GET /transactions/card/:cardId
 * @param cardId id de la carta
 * @returns todas las transacciones de la carta, puede ser un array vacío
 * @throws 400 - Si el cardId no es válido
 * @throws 500 - Si se produce un error de conexión con la base de datos
 */
transactionRouter.get('/card/:cardId', [
    param('cardId').notEmpty().withMessage('Card ID is required'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getTransactionsByCardId);


/**
 * Ruta para obtener todas las transacciones de una carta, por su cardId y username
 * @route GET /transactions/user/:username/:cardId
 * @param username nombre de usuario
 * @param cardId id de la carta
 * @returns todas las transacciones de la carta realizadas por el usuario, puede ser un array vacío
 * @throws 400 - Si el username o el cardId no son válidos
 * @throws 500 - Si se produce un error de conexión con la base de datos
 * @throws 404 - Si no se encuentra la transacción
 * 
 */
transactionRouter.get('/user/:username/:cardId', [
    param('cardId').notEmpty().withMessage('Card ID is required'),
    param('username').notEmpty().withMessage('Username is required'),
    param('username').isString().isLowercase().withMessage('Username must be a valid string in lowercase'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getTransactionsByCardIdAndUsername);

export default transactionRouter;