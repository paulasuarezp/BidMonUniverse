// tests/cardPackRouter.test.ts
import mongoose from 'mongoose';
import { server } from '../../../server';
import Transaction from '../../models/transaction';
import User from '../../models/user';
import { api, dropEntireDatabase, hashPassword } from '../helpers';
import initialTransactions from '../mockData/transaction.json';
import initialUsers from '../mockData/users.json';


let tokenAdmin: string;
let token: string;

beforeEach(async () => {
    await dropEntireDatabase();

    let hashedPassword = hashPassword('Password123-');

    for (const user of initialUsers) {
        const newUser = new User(user);
        newUser.password = hashedPassword;
        await newUser.save();
    }

    for (const transaction of initialTransactions) {
        const newTransaction = new Transaction(transaction);
        await newTransaction.save();
    }

    const response = await api.post('/api/users/login').send({ username: 'admin', password: 'Password123-' });
    tokenAdmin = response.body.token;

    const responseUser = await api.post('/api/users/login').send({ username: 'test', password: 'Password123-' });
    token = responseUser.body.token;
});

afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
});


describe('TRANSACTION ROUTES', () => {
    describe('GET /api/transactions', () => {
        it('should get all transactions', async () => {
            const response = await api
                .get('/api/transactions')
                .set('Authorization', `Bearer ${tokenAdmin}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(3);
        });
    });

    describe('GET /api/transactions/u/:username', () => {
        it('should return transactions for a valid username', async () => {
            const username = 'test';
            const response = await api
                .get(`/api/transactions/u/${username}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(3);
        });

    });

    describe('GET /api/transactions/c/:userCardId', () => {
        it('should return transactions for a valid userCardId', async () => {
            const userCardId = '66646db6a10d744749820f4b';
            const response = await api
                .get(`/api/transactions/c/${userCardId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
        });

    });

});

describe('TRANSACTION ROUTES Error Handling', () => {
    describe('GET /api/transactions', () => {
        it('shold return 403 if user is not admin', async () => {
            const response = await api
                .get('/api/transactions')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(403);
            expect(response.body).toEqual({ message: 'Acceso denegado. Se requiere rol de administrador.' });
        });
    });

    describe('GET /api/transactions/u/:username', () => {
        it('should return 400 for invalid username', async () => {
            const response = await api
                .get('/api/transactions/u/INVALIDUSERNAME2022')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(400);
            expect(response.body.errors).toContainEqual(
                expect.objectContaining({
                    msg: 'Username must be a valid string in lowercase',
                    param: 'username'
                })
            );
        });
    });

});
