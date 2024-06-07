const { check, validationResult } = require('express-validator');
import express, { Request, Response, Router } from 'express';
const cardRouter: Router = express.Router();

import {
    getUserCards,
    getUserCard,
    addNewUserCard,
    transferCard,
    putUserCardUpForAuction,
    withdrawnUserCardFromAuction
  } from '../controllers/userCardController';
  


cardRouter.post('/add-user-card', [
    check('user').notEmpty().withMessage('User ID is required'),
    check('userCard').notEmpty().withMessage('User Card is required'),
    check('concept').notEmpty().withMessage('Concept is required'),
    check('price').isFloat({ min: 0 }).withMessage('Price must be a valid number'),
    check('cardId').notEmpty().withMessage('Card ID is required'),
    check('auctionId').optional().isMongoId().withMessage('Invalid Auction ID'),
    check('cardPackId').optional().isMongoId().withMessage('Invalid Card Pack ID'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], addNewUserCard);

cardRouter.post('/transfer-card', [
    check('sellerId').notEmpty().withMessage('Seller ID is required'),
    check('buyerId').notEmpty().withMessage('Buyer ID is required'),
    check('cardId').notEmpty().withMessage('Card ID is required'),
    check('userCardId').notEmpty().withMessage('User Card ID is required'),
    check('salePrice').isFloat({ min: 0 }).withMessage('Sale price must be a valid number'),
    check('auctionId').optional().isMongoId().withMessage('Invalid Auction ID'),
    check('bidId').optional().isMongoId().withMessage('Invalid Bid ID'),
    (req, res, next) => {
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
    check('cardId').notEmpty().withMessage('Card ID is required'),
    check('auctionId').optional().isMongoId().withMessage('Invalid Auction ID'),
    (req, res, next) => {
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
    check('cardId').notEmpty().withMessage('Card ID is required'),
    check('auctionId').optional().isMongoId().withMessage('Invalid Auction ID'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ], withdrawnUserCardFromAuction);
  
  



export default cardRouter;