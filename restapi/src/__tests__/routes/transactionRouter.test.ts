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
    console.log(response.body.user.role);
    tokenAdmin = response.body.token;

    const responseUser = await api.post('/users/login').send({ username: 'test', password: 'Password123-' });
    token = responseUser.body.token;
});

afterAll(async () => {
    console.log('Deleting all data and closing connection...');
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

});
