const { check, param, validationResult } = require('express-validator');
import express, { Request, Response, Router } from 'express';
import auth from '../middlewares/authMiddleware';

const notificationRouter: Router = express.Router();

notificationRouter.use(auth);

import {
    getNotifications,
    hasUnreadNotifications,
    markAllAsRead,
    markAsRead
} from '../controllers/notificationController';


/**
 * Ruta para obtener todas las notificaciones
 * @route GET /notifications
 * @returns {Notification[]} 200 - Lista de notificaciones
 */
notificationRouter.get('/:username', [
    param('username').notEmpty().withMessage('Username is required'),
    param('username').isString().withMessage('Username must be a string'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getNotifications);

/**
 * Ruta para marcar una notificación como leída
 * @route PATCH /notification/:id/read
 * @param id id de la notificación
 * @returns {Notification} 200 - Notificación marcada como leída
 * @returns {Error}  400 - Error de validación
 */
notificationRouter.patch('/notification/:notificationId/read', [
    param('notificationId').notEmpty().withMessage('Notification ID is required'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], markAsRead);

/**
 * Ruta para marcar todas las notificaciones como leídas
 * @route PATCH /notifications/read/:username
 * @returns {Notification[]} 200 - Lista de notificaciones marcadas como leídas
 */
notificationRouter.patch('/read/:username', [
    param('username').notEmpty().withMessage('Username is required'),
    param('username').isString().withMessage('Username must be a string'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], markAllAsRead);



/**
 * Ruta para verificar si un usuario tiene notificaciones no leídas
 * @route GET /notifications/unread/:username
 * @param username del usuario
 * @returns {boolean} 200 - true si el usuario tiene notificaciones no leídas
 * @returns {Error}  400 - Error de validación
 */
notificationRouter.get('/unread/:username', [
    param('username').notEmpty().withMessage('Username is required'),
    param('username').isString().withMessage('Username must be a string'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], hasUnreadNotifications);

export default notificationRouter;