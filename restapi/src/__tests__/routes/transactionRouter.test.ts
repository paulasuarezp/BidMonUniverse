// tests/cardPackRouter.test.ts
import request from 'supertest';
import { api, dropEntireDatabase, hashPassword } from '../helpers';
import { server } from '../../../server';
import mongoose from 'mongoose';
import User from '../../models/user';
import initialUsers from '../mockData/users.json';
import initialTransactions from '../mockData/transaction.json';
import Transaction from '../../models/transaction';


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

    const response = await api.post('/users/login').send({ username: 'admin', password: 'Password123-' });
    tokenAdmin = response.body.token;

    const responseUser = await api.post('/users/login').send({ username: 'test', password: 'Password123-' });
    token = responseUser.body.token;
});

afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
});


describe('TRANSACTION ROUTES', () => {
    describe('GET /transactions', () => {
        it('should get all transactions', async () => {
            const response = await api
                .get('/transactions')
                .set('Authorization', `Bearer ${tokenAdmin}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(3);
        });

        it('shold return 403 if user is not admin', async () => {
            const response = await api
                .get('/transactions')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(403);
            expect(response.body).toEqual({ message: 'Acceso denegado. Se requiere rol de administrador.' });
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

    describe('GET /transactions/:transactionId', () => {
        it('should get a transaction by transactionId', async () => {
            let id = initialTransactions[0]._id;
            let username = initialTransactions[0].username;
            const response = await api
                .get('/transactions/' + id)
                .set('Authorization', `Bearer ${tokenAdmin}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('username', username);

        });

        it('should return 404 if transactionId does not exist', async () => {
            const response = await api
                .get('/transactions/77646db6a10d744749820f4c')
                .set('Authorization', `Bearer ${tokenAdmin}`);

            expect(response.status).toBe(404);
        });

    });

    describe('GET /transactions/u/:username', () => {
        it('should return transactions for a valid username', async () => {
            const username = 'test';
            const response = await api
                .get(`/transactions/u/${username}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(3);
        });

    });

    describe('GET /transactions/c/:userCardId', () => {
        it('should return transactions for a valid userCardId', async () => {
            const userCardId = '66646db6a10d744749820f4b';
            const response = await api
                .get(`/transactions/c/${userCardId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
        });

    });



});

describe('TRANSACTION ROUTES Error Handling', () => {
    describe('GET /transactions/:transactionId', () => {
        it('should return 400 for invalid transactionId', async () => {
            const response = await api
                .get('/transactions/invalid-id')
                .set('Authorization', `Bearer ${tokenAdmin}`);

            expect(response.status).toBe(400);
            expect(response.body.errors).toContainEqual(
                expect.objectContaining({
                    msg: 'Transaction ID must be a valid MongoID',
                    param: 'transactionId',
                    value: "invalid-id"
                })
            );
        });
    });

    describe('GET /transactions/u/:username', () => {
        it('should return 400 for invalid username', async () => {
            const response = await api
                .get('/transactions/u/INVALIDUSERNAME2022')
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
