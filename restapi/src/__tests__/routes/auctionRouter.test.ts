import mongoose from 'mongoose';
import { server } from '../../../server';
import Auction from '../../models/auction';
import Card from '../../models/card';
import User from '../../models/user';
import UserCard from '../../models/userCard';
import { api, dropEntireDatabase, hashPassword } from '../helpers';
import initialAuctions from '../mockData/auctions.json';
import initialBids from '../mockData/bids.json';
import initialUsers from '../mockData/users.json';

import Bid from '../../models/bid';
import initialCards from '../mockData/cards.json';
import initialUserCards from '../mockData/usercards.json';

let token: string;

beforeEach(async () => {
    await dropEntireDatabase();

    // Cargar usuarios iniciales
    let hashedPassword = hashPassword('Password123-');

    for (const user of initialUsers) {
        const newUser = new User(user);
        newUser.password = hashedPassword;
        await newUser.save();
    }

    // Cargar subastas iniciales
    for (const auction of initialAuctions) {
        const newAuction = new Auction(auction);
        await newAuction.save();
    }


    for (const card of initialCards) {
        const newCard = new Card(card);
        await newCard.save();
    }

    for (const userCard of initialUserCards) {
        const newUserCard = new UserCard(userCard);
        await newUserCard.save();
    }

    for (const bid of initialBids) {
        const newBid = new Bid(bid);
        await newBid.save();
    }

    // Obtener token de autenticación
    const response = await api.post('/api/users/login').send({ username: 'test', password: 'Password123-' });
    token = response.body.token;
});

afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
});

describe('AUCTION ROUTES', () => {
    describe('GET /', () => {
        it('should return all auctions', async () => {
            const response = await api
                .get('/api/auctions')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
        });
    });

    describe('GET /a/:id', () => {
        it('should return a specific auction', async () => {
            const response = await api
                .get('/api/auctions/a/667468a8920f1692e1068d40')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
        });

        it('should return 404 for non existent auction ID', async () => {
            const response = await api
                .get('/api/auctions/a/67468a8920f1692e1068d40f')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });

    describe('GET /active/:username', () => {
        it('should return all active auctions for a valid username', async () => {
            const response = await api
                .get('/api/auctions/active/test')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
        });

    });

    describe('GET /active/u/:username', () => {
        it('should return all active auctions for a user', async () => {
            const response = await api
                .get('/api/auctions/active/u/test')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });

    });

});