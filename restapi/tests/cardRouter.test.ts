import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getCards, getCard, updateCardReferences } from '../src/controllers/cardController';
import Card from '../src/models/card';
import UserCard from '../src/models/userCard';
import User from '../src/models/user';
import { Request, Response } from 'express';

jest.mock('../src/models/card');
jest.mock('../src/models/userCard');

describe('CardController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let token: string;

  beforeEach(async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const user = new User({
      username: 'testuser',
      username_lower: 'testuser',
      password: hashedPassword,
      role: 'standard',
      birthday: '2000-01-01'
    });
    await user.save();

    token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.TOKEN_SECRET!,
      { expiresIn: '1h' }
    );

    req = {
      params: {},
      body: {},
      headers: {
        authorization: `Bearer ${token}`
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getCards', () => {
    it('should get all cards', async () => {
      const mockCards = [{ id: 1, name: 'Test Card' }];
      (Card.find as jest.Mock).mockResolvedValue(mockCards);

      await getCards(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCards);
    });

    it('should handle errors', async () => {
      (Card.find as jest.Mock).mockRejectedValue(new Error('Database error'));

      await getCards(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Se ha producido un error al obtener las cartas.' });
    });
  });

  describe('getCard', () => {
    it('should get a card by ID', async () => {
      req.params = { cardId: '1' };
      const mockCard = { id: '1', name: 'Test Card' };
      (Card.findOne as jest.Mock).mockResolvedValue(mockCard);

      await getCard(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCard);
    });

    it('should return 404 if card not found', async () => {
      req.params = { cardId: '1' };
      (Card.findOne as jest.Mock).mockResolvedValue(null);

      await getCard(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Carta no encontrada.' });
    });

    it('should handle errors', async () => {
      req.params = { cardId: '1' };
      (Card.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

      await getCard(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Se ha producido un error al obtener la carta.' });
    });
  });

});
