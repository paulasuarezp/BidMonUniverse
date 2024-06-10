// tests/userController.test.ts
import { Request, Response } from 'express';
import { createUser, loginUser, getUser } from '../src/controllers/userController';
import User from '../src/models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../src/models/user');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('UserController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  describe('createUser', () => {
    it('should return 400 if username or password is missing', async () => {
      await createUser(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Debe de introducir un nombre de usuario y una contraseña.');
    });

    it('should return 400 if user already exists', async () => {
      req.body = { username: 'testuser', password: 'password123' };
      (User.findOne as jest.Mock).mockResolvedValue({ username_lower: 'testuser' });

      await createUser(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'El nombre de usuario ya existe. Por favor, elija otro.', auth: false });
    });

    it('should create user if valid data is provided', async () => {
      req.body = { username: 'testuser', password: 'password123' };
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (User.prototype.save as jest.Mock).mockResolvedValue({ username: 'testuser', role: 'standard' });

      await createUser(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Usuario creado con éxito.', user: { username: 'testuser', role: 'standard' } });
    });

    it('should handle errors gracefully', async () => {
      req.body = { username: 'testuser', password: 'password123' };
      (User.findOne as jest.Mock).mockRejectedValue(new Error('Error'));

      await createUser(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Se ha producido un error al crear el usuario. Por favor, inténtelo de nuevo.', auth: false });
    });
  });

  describe('loginUser', () => {
    it('should return 401 if user does not exist', async () => {
      req.body = { username: 'testuser', password: 'password123' };
      (User.findOne as jest.Mock).mockResolvedValue(null);
  
      await loginUser(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Usuario o contraseña incorrectos.', auth: false });
    });
  
    it('should return 401 if password is invalid', async () => {
      req.body = { username: 'testuser', password: 'password123' };
      (User.findOne as jest.Mock).mockResolvedValue({ username: 'testuser', password: 'hashedPassword' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
  
      await loginUser(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Usuario o contraseña incorrectos.', auth: false });
    });
  
    it('should return token if login is successful', async () => {
      req.body = { username: 'testuser', password: 'password123' };
      (User.findOne as jest.Mock).mockResolvedValue({ username: 'testuser', password: 'hashedPassword', role: 'standard', balance: 100, birthday: '2000-01-01', profileImg: 'img.png' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('token');
  
      await loginUser(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Inicio de sesión exitoso.',
        auth: true,
        user: {
          username: 'testuser',
          role: 'standard',
          balance: 100,
          birthday: '2000-01-01',
          profileImg: 'img.png'
        },
        token: 'token'
      });
    });
  
    it('should handle errors gracefully', async () => {
      req.body = { username: 'testuser', password: 'password123' };
      (User.findOne as jest.Mock).mockRejectedValue(new Error('Error'));
  
      await loginUser(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Se ha producido un error al verificar credenciales. Por favor, inténtelo de nuevo.', auth: false });
    });
  });

  describe('getUser', () => {
    it('should return 404 if user is not found', async () => {
      req.params = { username: 'testuser' };
      (User.findOne as jest.Mock).mockResolvedValue(null);
  
      await getUser(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Usuario no encontrado.' });
    });
  
    it('should return user if user is found', async () => {
      req.params = { username: 'testuser' };
      (User.findOne as jest.Mock).mockResolvedValue({ username: 'testuser', role: 'standard', balance: 100, birthday: '2000-01-01', profileImg: 'img.png' });
  
      await getUser(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        user: {
          username: 'testuser',
          role: 'standard',
          balance: 100,
          birthday: '2000-01-01',
          profileImg: 'img.png'
        }
      });
    });
  
    it('should handle errors gracefully', async () => {
      req.params = { username: 'testuser' };
      (User.findOne as jest.Mock).mockRejectedValue(new Error('Error'));
  
      await getUser(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Se ha producido un error al buscar el usuario. Por favor, inténtelo de nuevo.' });
    });
  });
  
  
});
