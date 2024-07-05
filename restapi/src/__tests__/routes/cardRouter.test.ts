// tests/cardRouter.test.ts
import mongoose from 'mongoose';
import { server } from '../../../server';
import Card from '../../models/card';
import User from '../../models/user';
import { api, dropEntireDatabase, hashPassword } from '../helpers';
import initialCards from '../mockData/cards.json';
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

    for (const card of initialCards) {
        const newCard = new Card(card);
        await newCard.save();
    }

    const response = await api.post('/api/users/login').send({ username: 'test', password: 'Password123-' });
    token = response.body.token;
});

afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
});


describe('CARD ROUTES', () => {

    describe('GET /api/cards/:cardId', () => {
        it('should get a card by ID', async () => {
            const response = await api
                .get('/api/cards/c-1-0')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({ name: 'bulbasaur' }));
        });
    });
});

describe('CARD ROUTES Error Handling', () => {

    describe('GET /api/cards/:cardId', () => {
        it('should return 404 if card not found', async () => {
            const response = await api
                .get('/api/cards/nonexistent')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Carta no encontrada.' });
        });

        it('should handle errors', async () => {
            jest.spyOn(mongoose.Model, 'findOne').mockRejectedValueOnce(new Error('Database error'));

            const response = await api
                .get('/api/cards/c-1-0')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Se ha producido un error al obtener la carta.' });
        });
    });
});