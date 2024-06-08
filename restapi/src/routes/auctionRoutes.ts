const { check, validationResult } = require('express-validator');
import express, { Request, Response, Router } from 'express';

const auctionRouter: Router = express.Router();

const auth = require('../middlewares/authMiddleware');

auctionRouter.use(auth);

import {
    getAuctions,
    getAuction,
    getActiveAuctions,
    getActiveAuctionByUser,
    putUserCardUpForAuction,
    withdrawnUserCardFromAuction
} from '../controllers/auctionController';


/**
 * Ruta para obtener todas las subastas
 * @route GET /auctions
 * @returns {Auction[]} 200 - Lista de subastas
 */
auctionRouter.get('/auctions', getAuctions);

/**
 * Ruta para obtener una subasta por su ID
 * @route GET /auction/:id
 * @param id id de la subasta
 * @returns {Auction} 200 - Subasta
 * @returns {Error}  400 - Error de validación
 */
auctionRouter.get('/auction/:id', [
    check('id').notEmpty().withMessage('Auction ID is required'),
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
 * @route GET /active-auctions
 * @returns {Auction[]} 200 - Lista de subastas activas
 */
auctionRouter.get('/active-auctions', getActiveAuctions);

/**
 * Ruta para obtener todas las subastas activas de un usuario
 * @route GET /active-auctions/:username
 * @param username del usuario
 * @returns {Auction[]} 200 - Lista de subastas activas del usuario
 * @returns {Error}  400 - Error de validación
 */
auctionRouter.get('/active-auctions/:username', [
    check('username').notEmpty().withMessage('Username is required'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getActiveAuctionByUser);

/**
 * Ruta para poner una carta en subasta
 * @route POST /put-auction-card
 * @param username del usuario
 * @param userCardId id de la carta del usuario (MongoDB ID)
 * @param cardId id de la carta (card ID)
 * @param saleBase precio base de la subasta
 * @param duration duración de la subasta
 * @returns {Auction, Transaction} 200 - Subasta que se ha creado y transacción de registro de la subasta
 * @throws {Error}  400 - Error de validación
 * @throws {Error}  500 - Error al poner la carta en subasta
 */
auctionRouter.post('/put-auction-card', [
    check('username').notEmpty().withMessage('Username is required'),
    check('userCardId').notEmpty().withMessage('User Card ID is required'),
    check('cardId').notEmpty().withMessage('Card ID is required'),
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
 * @route POST /withdraw-auction-card
 * @param username del usuario
 * @param userCardId id de la carta del usuario (MongoDB ID)
 * @param auctionId id de la subasta
 * @returns {Auction, Transaction} 200 - Lista de subastas activas del usuario
 * @throws {Error}  400 - Error de validación
 * @throws {Error}  500 - Error al retirar la carta de la subasta
 */
  auctionRouter.post('/withdraw-auction-card', [
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

export default auctionRouter;