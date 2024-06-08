const { check, validationResult } = require('express-validator');
import express, { Request, Response, Router } from 'express';

const cardRouter: Router = express.Router();

const auth = require('../middlewares/authMiddleware');

cardRouter.use(auth);

import {
    getUserCards,
    getUserCard,
    addNewUserCard,
    transferCard,
    putUserCardUpForAuction,
    withdrawnUserCardFromAuction
  } from '../controllers/userCardController';
  
// Obtener todas las cartas de un usuario
cardRouter.get('/:username', [
    check('username').notEmpty().withMessage('Username is required'),
    check('username').isString().withMessage('Username must be a string'),
    check('username').isLength({ max: 12 }).withMessage('Username must be at most 12 characters long'),
    (req: Request, res: Response, next: any) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ], getUserCards);
  
  // Obtener una carta de un usuario por ID de carta
  cardRouter.get('/:username/:cardId', [
    check('username').notEmpty().withMessage('Username is required'),
    check('username').isString().withMessage('Username must be a string'),
    check('username').isLength({ max: 12 }).withMessage('Username must be at most 12 characters long'),
    check('cardId').notEmpty().withMessage('Card ID is required'),
    check('cardId').isString().withMessage('Card ID must be a string'),
    (req: Request, res: Response, next: any) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ], getUserCard);


cardRouter.post('/add', [
    check('username').notEmpty().withMessage('Username is required'),
    check('cardId').notEmpty().withMessage('Card ID is required'),
    check('price').isFloat({ min: 0 }).withMessage('Price must be a valid number'),
    check('auctionId').optional().isString().withMessage('Invalid Auction ID'),
    check('bidId').optional().isString().withMessage('Invalid Bid ID'),
    check('cardPackId').optional().isString().withMessage('Invalid Card Pack ID'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], addNewUserCard);


cardRouter.post('/transfer', [
    check('sellerUsername').notEmpty().withMessage('Seller ID is required'),
    check('buyerUsername').notEmpty().withMessage('Buyer ID is required'),
    check('cardId').notEmpty().withMessage('Card ID is required'),
    check('userCardId').notEmpty().withMessage('User Card ID is required'),
    check('salePrice').isFloat({ min: 0 }).withMessage('Sale price must be a valid number'),
    check('auctionId').notEmpty().withMessage('Auction ID is required'),
    check('bidId').notEmpty().withMessage('Bid ID is required'),
    (req: Request, res: Response, next: any) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ], transferCard);

  

  cardRouter.post('/put-auction-card', [
    check('sellerId').notEmpty().withMessage('Seller ID is required'),
    check('userCardId').notEmpty().withMessage('User Card ID is required'),
    check('saleBase').isFloat({ min: 0 }).withMessage('Base sale price must be a valid number'),
    (req: Request, res: Response, next: any) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ], putUserCardUpForAuction);


  cardRouter.post('/withdraw-auction-card', [
    check('sellerId').notEmpty().withMessage('Seller ID is required'),
    check('userCardId').notEmpty().withMessage('User Card ID is required'),
    check('auctionId').optional().isMongoId().withMessage('Invalid Auction ID'),
    (req: Request, res: Response, next: any) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ], withdrawnUserCardFromAuction);
  
  



export default cardRouter;