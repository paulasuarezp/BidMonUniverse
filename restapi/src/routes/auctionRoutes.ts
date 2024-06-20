const { check, param, validationResult } = require('express-validator');
import express, { Request, Response, Router } from 'express';
import auth from '../middlewares/authMiddleware';

const auctionRouter: Router = express.Router();

auctionRouter.use(auth);

import {
    checkAllActiveAuctions,
    getActiveAuctions,
    getActiveAuctionsByPokemonName,
    getActiveAuctionsByUser,
    getAuction,
    getAuctions,
    putUserCardUpForAuction,
    withdrawnUserCardFromAuction
} from '../controllers/auctionController';

/**
 * Ruta para obtener todas las subastas
 * @route GET /
 * @returns {Auction[]} 200 - Lista de subastas
 */
auctionRouter.get('/', getAuctions);

/**
 * Ruta para obtener una subasta por su ID
 * @route GET /a/:id
 * @param id id de la subasta
 * @returns {Auction} 200 - Subasta
 * @returns {Error}  400 - Error de validación
 */
auctionRouter.get('/a/:id', [
    param('id').notEmpty().withMessage('Auction ID is required'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getAuction);

/**
 * Ruta para obtener todas las subastas activas
 * @route GET /active
 * @returns {Auction[]} 200 - Lista de subastas activas
 */
auctionRouter.get('/active/:username', [
    param('username').notEmpty().withMessage('Username is required'),
    param('username').isString().withMessage('Username must be a valid string'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getActiveAuctions);

/**
 * Ruta para obtener todas las subastas activas de un usuario
 * @route GET /active/:username
 * @param username del usuario
 * @returns {Auction[]} 200 - Lista de subastas activas del usuario
 * @returns {Error}  400 - Error de validación
 */
auctionRouter.get('/active/u/:username', [
    param('username').notEmpty().withMessage('Username is required'),
    param('username').isString().withMessage('Username must be a valid string'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getActiveAuctionsByUser);

/**
 * Ruta para obtener todas las subastas activas de un usuario
 * @route GET /active/pokemon/:pokemonName
 * @param pokemonName nombre del pokemon
 * @returns {Auction[]} 200 - Lista de subastas activas del usuario
 * @returns {Error}  400 - Error de validación
 */
auctionRouter.get('/active/pokemon/:pokemon', [
    param('pokemon').notEmpty().withMessage('Pokemon name is required'),
    param('pokemon').isString().withMessage('Pokemon name must be a string'),
    param('pokemon').isLength({ min: 1, max: 20 }).withMessage('Pokemon name must be between 1 and 20 characters long'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getActiveAuctionsByPokemonName);

/**
 * Ruta para poner una carta en subasta
 * @route POST /add
 * @param username del usuario
 * @param userCardId id de la carta del usuario (MongoDB ID)
 * @param cardId id de la carta (card ID)
 * @param saleBase precio base de la subasta
 * @param duration duración de la subasta
 * @returns {Auction, Transaction} 200 - Subasta que se ha creado y transacción de registro de la subasta
 * @throws {Error}  400 - Error de validación
 * @throws {Error}  500 - Error al poner la carta en subasta
 */
auctionRouter.post('/add', [
    check('username').notEmpty().withMessage('Username is required'),
    check('userCardId').notEmpty().withMessage('User Card ID is required'),
    check('saleBase').isInt({ min: 1 }).withMessage('Sale base must be a valid number'),
    check('duration').isInt({ min: 1 }).withMessage('Duration must be a valid number'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], putUserCardUpForAuction);


/**
 * Ruta para retirar una carta de una subasta
 * @route POST /withdraw
 * @param username del usuario
 * @param userCardId id de la carta del usuario (MongoDB ID)
 * @param auctionId id de la subasta
 * @returns {Auction, Transaction} 200 - Lista de subastas activas del usuario
 * @throws {Error}  400 - Error de validación
 * @throws {Error}  500 - Error al retirar la carta de la subasta
 */
auctionRouter.post('/withdraw', [
    check('username').notEmpty().withMessage('Username is required'),
    check('userCardId').notEmpty().withMessage('User Card ID is required'),
    check('auctionId').notEmpty().withMessage('Auction ID is required'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], withdrawnUserCardFromAuction);


/**
 * Ruta para verificar todas las subastas activas, y si alguna ha finalizado, se actualiza su estado y se notifica al ganador.
 * @route GET /check
 * @returns {Auction[]} 200 - Lista de subastas actualizadas, con sus respectivos ganadores notificados
 */

auctionRouter.get('/check', checkAllActiveAuctions);


export default auctionRouter;