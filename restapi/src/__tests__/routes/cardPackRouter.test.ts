// tests/cardPackRouter.test.ts
import request from 'supertest';
import { api, hashPassword, dropEntireDatabase } from '../helpers';
import { server } from '../../../server';
import mongoose from 'mongoose';
import User from '../../models/user';
import initialUsers from '../mockData/users.json';
import initialCardPacks from '../mockData/cardPacks.json';
import CardPack from '../../models/cardpack';


let token: string;

beforeEach(async () => {
    await dropEntireDatabase();

    let hashedPassword = hashPassword('Password123-');

    for (const user of initialUsers) {
        const newUser = new User(user);
        newUser.password = hashedPassword;
        await newUser.save();
    }

    for (const pack of initialCardPacks) {
        const newCard = new CardPack(pack);
        await newCard.save();
    }

    const response = await api.post('/users/login').send({ username: 'test', password: 'Password123-' });
    token = response.body.token;
});

afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
});


describe('CARDPACK ROUTES', () => {
    describe('GET /cardpacks', () => {
        it('should get all card packs availables', async () => {
            const response = await api
                .get('/cardpacks')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);

            let initialCardPacksFiltered = initialCardPacks.filter(pack => pack.available);

            expect(response.body).toHaveLength(initialCardPacksFiltered.length);
        });

        it('should handle errors', async () => {
            jest.spyOn(mongoose.Model, 'find').mockRejectedValueOnce(new Error('Database error'));

            const response = await api
                .get('/cardpacks')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Se ha producido un error al obtener los paquetes de cartas.' });
        });
    });

    describe('GET /cardpacks/:cardPackId', () => {
        it('should get a card pack by cardPackid', async () => {
            const response = await api
                .get('/cardpacks/CP-1')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({ name: 'Starter Pack' }));
        });

        it('should return 404 if card pack not found', async () => {
            const response = await api
                .get('/cardpacks/CP-6')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Paquete de cartas no encontrado.' });
        });

        it('shoul return 400 if cardPackId is invalid', async () => {
            const response = await api
                .get('/cardpacks/CP-tolaaaaargeeeee')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(400);
        });

        it('should handle errors', async () => {
            jest.spyOn(mongoose.Model, 'findOne').mockRejectedValueOnce(new Error('Database error'));

            const response = await api
                .get('/cardpacks/CP-1')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Se ha producido un error al obtener el paquete de cartas.' });
        });
    });
});
