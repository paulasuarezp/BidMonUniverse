import request from 'supertest';
import { app } from '../server';
import jwt from 'jsonwebtoken';
import User from '../src/models/user';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

describe('CardController', () => {
  let token: string;

  beforeAll(async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password123-', salt);

    const user = new User({
      username: 'testuser',
      username_lower: 'testuser',
      password: hashedPassword,
      role: 'standard',
      birthday: '2000-01-01',
    });
    await user.save();

    token = jwt.sign(
      { username: user.username, role: user.role, time: Date.now() / 1000 },
      process.env.TOKEN_SECRET!,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      const collections = await mongoose.connection.db.collections();

      for (const collection of collections) {
        await collection.drop();
      }

      await mongoose.connection.close();

    }
  });

  describe('getCards', () => {
    it('should get all cards', async () => {
      const response = await request(app)
        .get('/cards')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(24);
    });

    it('should handle errors', async () => {
      jest.spyOn(mongoose.Model, 'find').mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/cards')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Se ha producido un error al obtener las cartas.' });
    });
  });

  describe('getCard', () => {
    it('should get a card by ID', async () => {
      const response = await request(app)
        .get('/cards/c-1-0')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({ name: 'bulbasaur' }));
    });

    it('should return 404 if card not found', async () => {
      const response = await request(app)
        .get('/cards/nonexistent')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Carta no encontrada.' });
    });

    it('should handle errors', async () => {
      jest.spyOn(mongoose.Model, 'findOne').mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/cards/c-1-0')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Se ha producido un error al obtener la carta.' });
    });
  });
});
