// tests/cardRouter.test.ts
import request from 'supertest';
import { api, dropEntireDatabase, hashPassword } from '../helpers';
import { server } from '../../../server';
import mongoose from 'mongoose';
import User from '../../models/user';
import initialUsers from '../mockData/users.json';
import initialCards from '../mockData/cards.json';
import initialDecks from '../mockData/decks.json';
import Card from '../../models/card';
import Deck from '../../models/deck';


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

    for (const deck of initialDecks) {
        const newDeck = new Deck(deck);
        await newDeck.save();
    }

    const response = await api.post('/users/login').send({ username: 'test', password: 'Password123-' });
    token = response.body.token;
});

afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
});


describe('DECK ROUTES', () => {
    describe('GET /decks', () => {
        it('should get all decks', async () => {
            const response = await api
                .get('/decks')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(4);
        });

        it('should handle errors', async () => {
            jest.spyOn(mongoose.Model, 'find').mockRejectedValueOnce(new Error('Database error'));

            const response = await api
                .get('/decks')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Se ha producido un error al obtener los mazos de cartas.' });
        });
    });

    describe('GET /decks/:deckid', () => {
        it('should get a deck by deckId', async () => {
            const response = await api
                .get('/decks/d-4')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);

            expect(response.body).toEqual(expect.objectContaining({
                deckId: 'd-4',
                name: 'Deck Legendary',
                type: 'legendary',
                publicationDate: '2024-06-06T18:33:25.000Z'
            }));

        });

        it('should return 404 if deck does not exist', async () => {
            const response = await api
                .get('/decks/999')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Mazo de cartas no encontrado.' });
        });

        it('should handle errors', async () => {
            jest.spyOn(mongoose.Model, 'findOne').mockRejectedValueOnce(new Error('Database error'));

            const response = await api
                .get('/decks/1')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Se ha producido un error al obtener el mazo de cartas.' });
        });
    });
});

