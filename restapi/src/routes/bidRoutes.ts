const { check, param, validationResult } = require('express-validator');
import express, { Request, Response, Router } from 'express';
import auth from '../middlewares/authMiddleware';

const bidRouter: Router = express.Router();
bidRouter.use(auth);

import {
  createBid,
  getActiveBidsByUser,
  getBidById,
  getBidHistoryByAuction,
  getBidHistoryByUser,
  withdrawBid
} from '../controllers/bidController';


/**
 * Ruta para obtener una puja por su ID
 * @route GET /b/:id
 * @param id id de la puja
 * @returns {Auction} 200 - Puja
 * @returns {Error}  400 - Error de validación
 */
bidRouter.get('/b/:id', [
  param('id').notEmpty().withMessage('Bid ID is required'),
  (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
], getBidById);


/**
 * Ruta para crear una puja
 * @route POST /add
 * @param auctionId ID de la subasta
 * @param username Nombre de usuario
 * @param amount Monto de la puja
 * @returns {Bid} 200 - Puja creada
 * @returns {Error}  400 - Error de validación
 */
bidRouter.post('/add', [
  check('auctionId').notEmpty().withMessage('Auction ID is required'),
  check('username').notEmpty().withMessage('Username is required'),
  check('amount').notEmpty().withMessage('Amount is required'),
  (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
], createBid);

/**
 * Ruta para obtener el historial de pujas de un usuario
 * @route GET /bid-history/:username
 * @param username Nombre de usuario
 * @returns {Bid[]} 200 - Historial de pujas del usuario
 * @returns {Error}  400 - Error de validación
 */
bidRouter.get('/bid-history/:username', [
  param('username').notEmpty().withMessage('Username is required'),
  param('username').isString().isLowercase().withMessage('Username must be a valid string in lowercase'),
  (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
], getBidHistoryByUser);

/**
 * Ruta para obtener el historial de pujas de una subasta
 * @route GET /bid-history/auction/:auctionId
 * @param auctionId ID de la subasta
 * @returns {Bid[]} 200 - Historial de pujas de la subasta
 * @returns {Error}  400 - Error de validación
 */
bidRouter.get('/bid-history/auction/:auctionId', [
  param('auctionId').notEmpty().withMessage('Auction ID is required'),
  (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
], getBidHistoryByAuction);

/**
 * Ruta para obtener las pujas activas de un usuario
 * @route GET /active/u/:username
 * @param username Nombre de usuario
 * @returns {Bid[]} 200 - Pujas activas del usuario
 * @returns {Error}  400 - Error de validación
 */
bidRouter.get('/active/u/:username', [
  param('username').notEmpty().withMessage('Username is required'),
  param('username').isString().isLowercase().withMessage('Username must be a valid string in lowercase'),
  (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
], getActiveBidsByUser);

/**
 * Ruta para retirar una puja
 * @route PATCH /withdraw
 * @param bidId ID de la puja
 * @param username Nombre de usuario que retira la puja
 * @returns {Bid} 200 - Puja retirada
 * @returns {Error} 400 - Error de validación
 */
bidRouter.patch('/withdraw', [
  check('bidId').notEmpty().withMessage('Bid ID is required'),
  check('username').notEmpty().withMessage('Username is required'),
  check('username').isString().withMessage('Username must be a valid string in lowercase'),
  (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
], withdrawBid);

export default bidRouter;