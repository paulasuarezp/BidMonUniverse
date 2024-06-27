// tests/cardPackRouter.test.ts
import mongoose from 'mongoose';
import { server } from '../../../server';
import CardPack from '../../models/cardpack';
import User from '../../models/user';
import { api, dropEntireDatabase, hashPassword } from '../helpers';
import initialCardPacks from '../mockData/cardPacks.json';
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
    });
});