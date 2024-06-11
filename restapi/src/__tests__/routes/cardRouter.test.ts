// tests/cardRouter.test.ts
import request from 'supertest';
import { api, getToken, hashPassword } from '../helpers';
import { server } from '../../../server';
import mongoose from 'mongoose';
import User from '../../models/user';
import initialUsers from '../mockData/users.json';
import initialCards from '../mockData/cards.json';
import Card from '../../models/card';


let token: string;

beforeEach(async () => {
    await User.deleteMany({});
    await Card.deleteMany({});

    let hashedPassword = hashPassword('Password123-');

    for (const user of initialUsers) {
        const newUser = new User(user);
        newUser.password = hashedPassword;
        await newUser.save();
    }

    for (const card of initialCards) {
        const newCard = new Card(card);
        await newCard.save();
    }

    const response = await api.post('/users/login').send({ username: 'test', password: 'Password123-' });
    token = getToken(response.body.username, response.body.role);
});

afterAll(async () => {
    console.log('Deleting all data and closing connection...');
    await User.deleteMany({});
    await Card.deleteMany({});
    await mongoose.connection.close();
    await server.close();
});


describe('CardController', () => {
    describe('getCards', () => {
        it('should get all cards', async () => {
            const response = await api
                .get('/cards')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(12);
        });

        it('should handle errors', async () => {
            jest.spyOn(mongoose.Model, 'find').mockRejectedValueOnce(new Error('Database error'));

            const response = await api
                .get('/cards')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Se ha producido un error al obtener las cartas.' });
        });
    });

    describe('getCard', () => {
        it('should get a card by ID', async () => {
            const response = await api
                .get('/cards/c-1-0')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({ name: 'bulbasaur' }));
        });

        it('should return 404 if card not found', async () => {
            const response = await api
                .get('/cards/nonexistent')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Carta no encontrada.' });
        });

        it('should handle errors', async () => {
            jest.spyOn(mongoose.Model, 'findOne').mockRejectedValueOnce(new Error('Database error'));

            const response = await api
                .get('/cards/c-1-0')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Se ha producido un error al obtener la carta.' });
        });
    });
});
