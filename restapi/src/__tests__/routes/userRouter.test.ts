// tests/userRouter.test.ts
import request from 'supertest';
import { api, hashPassword, dropEntireDatabase } from '../helpers';
import { server } from '../../../server';
import mongoose from 'mongoose';
import User from '../../models/user';
import initialUsers from '../mockData/users.json';


let token: string;

beforeEach(async () => {

  await dropEntireDatabase();

  let hashedPassword = hashPassword('Password123-');

  for (const user of initialUsers) {
    const newUser = new User(user);
    newUser.password = hashedPassword;
    await newUser.save();
  }

  const response = await api.post('/users/login').send({ username: 'test', password: 'Password123-' });
  token = response.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.close();
});

describe('User Routes', () => {
  describe('POST /login', () => {
    it('should login an existing user', async () => {
      const response = await api
        .post('/users/login')
        .send({ username: 'test', password: 'Password123-' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        message: 'Inicio de sesión exitoso.',
        auth: true,
        user: expect.objectContaining({
          username: 'test',
          role: 'standard',
          balance: 100,
          birthday: '2000-10-24',
          profileImg: 'avatar.png'
        }),
        token: expect.any(String)
      }));
    });

  });

  describe('POST /signup', () => {
    it('should create a new user', async () => {
      const response = await api
        .post('/users/signup')
        .send({ username: 'newuser', password: 'Password123-', birthday: '2000-01-01' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining({
        message: 'Usuario creado con éxito.',
        user: { username: 'newuser', role: 'standard' }
      }));
    });

  });

  describe('GET /:username', () => {
    it('should get user details with valid token', async () => {
      const response = await api
        .get('/users/test')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        user: expect.objectContaining({
          username: 'test',
          role: 'standard',
          balance: 100,
          birthday: '2000-10-24',
          profileImg: 'avatar.png'
        })
      }));
    });

    it('should return 401 if no token is provided', async () => {
      const response = await api.get('/users/test');

      expect(response.status).toBe(401);
    });

    it('should return 404 if user is not found', async () => {
      const response = await api
        .get('/users/nonexist')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Usuario no encontrado.' });
    });

    it('should handle errors gracefully', async () => {
      jest.spyOn(User, 'findOne').mockRejectedValueOnce(new Error('Error'));

      const response = await api
        .get('/users/testuser')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Se ha producido un error al buscar el usuario. Por favor, inténtelo de nuevo.' });
    });
  });
});


describe('USER ROUTES Error Handling', () => {
  describe('GET /:username', () => {
    it('should return 400 if username is too long', async () => {
      const response = await api
        .get('/users/thisusernameiswaytoolongtobevalid')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /login', () => {
    it('should return 401 if user does not exist', async () => {
      const response = await api
        .post('/users/login')
        .send({ username: 'nonexistentuser', password: 'Password123-' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Usuario o contraseña incorrectos.', auth: false });
    });

    it('should return 401 if password is invalid', async () => {
      const response = await api
        .post('/users/login')
        .send({ username: 'test', password: 'WrongPassword' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Usuario o contraseña incorrectos.', auth: false });
    });

    it('should handle errors gracefully', async () => {
      jest.spyOn(User, 'findOne').mockRejectedValueOnce(new Error('Error'));

      const response = await api
        .post('/users/login')
        .send({ username: 'test', password: 'Password123-' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Se ha producido un error al verificar credenciales. Por favor, inténtelo de nuevo.', auth: false });
    });
  });

  describe('POST /signup', () => {
    it('should return 400 if username already exists', async () => {
      const response = await api
        .post('/users/signup')
        .send({ username: 'test', password: 'Password123-', birthday: '2000-01-01' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual(expect.objectContaining({
        message: 'El nombre de usuario ya existe. Por favor, elija otro.',
        auth: false
      }));
    });

    it('should return 400 if username or password is missing', async () => {
      const response = await api
        .post('/users/signup')
        .send({ username: '', password: '' });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Debe de introducir un nombre de usuario y una contraseña.');
    });

    it('should handle errors gracefully', async () => {
      jest.spyOn(User, 'findOne').mockRejectedValueOnce(new Error('Error'));

      const response = await api
        .post('/users/signup')
        .send({ username: 'newuser', password: 'Password123-', birthday: '2000-01-01' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual(expect.objectContaining({
        message: 'Se ha producido un error al crear el usuario. Por favor, inténtelo de nuevo.',
        auth: false
      }));
    });
  });
});
