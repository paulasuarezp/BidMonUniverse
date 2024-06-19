// tests/cardRouter.test.ts
import request from 'supertest';
import { api, hashPassword, dropEntireDatabase } from '../helpers';
import { server } from '../../../server';
import mongoose from 'mongoose';
import User from '../../models/user';
import initialUsers from '../mockData/users.json';
import initialCards from '../mockData/cards.json';
import initialUserCards from '../mockData/usercards.json';
import UserCard from '../../models/userCard';
import Card from '../../models/card';


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

    for (const userCard of initialUserCards) {
        const newUserCard = new UserCard(userCard);
        await newUserCard.save();
    }

    const response = await api.post('/users/login').send({ username: 'test', password: 'Password123-' });
    token = response.body.token;
});

afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
});

describe('USERCARD ROUTES', () => {
    describe('GET /usercards/:username', () => {
        it('should return user usercards for a valid username', async () => {
            const response = await api
                .get('/usercards/test')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });


        it('should return 400 if username is too long', async () => {
            const response = await api
                .get('/usercards/thisusernameiswaytoolongtobevalid')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(400);
            expect(response.body.errors).toContainEqual(
                expect.objectContaining({
                    msg: 'Username must be at most 12 characters long'
                })
            );
        });
    });

    describe('GET /usercards/:username/:cardId', () => {
        it('should return a specific user card', async () => {
            const response = await api
                .get('/usercards/test/c-1-0')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('legibleCardId', 'c-1-0');
        });

        it('should return 404 if cardId is not a valid cardId', async () => {
            const response = await api
                .get('/usercards/test/1')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });

});
