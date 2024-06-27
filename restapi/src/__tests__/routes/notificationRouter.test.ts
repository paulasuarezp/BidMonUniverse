import mongoose from 'mongoose';
import { server } from '../../../server';
import Notificacion from '../../models/notification';
import User from '../../models/user';
import { api, dropEntireDatabase, hashPassword } from '../helpers';
import initialNotifications from '../mockData/notifications.json';
import initialUsers from '../mockData/users.json';


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
    for (const notification of initialNotifications) {
        const newNotification = new Notificacion(notification);
        await newNotification.save();
    }

    // Obtener token de autenticación
    const response = await api.post('/users/login').send({ username: 'test', password: 'Password123-' });
    token = response.body.token;
});

afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
});

describe('NOTIFICATIONS ROUTES', () => {

    describe('GET /:username', () => {
        it('should return all notifications for a valid username', async () => {
            const response = await api
                .get('/notifications/test')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
        });
    });

    describe('GET /unread/:username', () => {
        it('should return all unread notifications for a valid username', async () => {
            const response = await api
                .get('/notifications/unread/test')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
        });
    });

    describe('PATCH /notification/:notificationId/read', () => {
        it('should mark a notification as read', async () => {
            const response = await api
                .patch('/notifications/notification/5f8f4b3b9b3f3b001f3f3b3b/read')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
        });

    });

    describe('PATCH /read/:username', () => {
        it('should mark all user notifications as read', async () => {
            const response = await api
                .patch('/notifications/read/test')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
        });

    });


});