const { check, param, validationResult } = require('express-validator');
import express, { Request, Response, Router } from 'express';

const notificationRouter: Router = express.Router();

const auth = require('../middlewares/authMiddleware');

notificationRouter.use(auth);

import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    hasUnreadNotifications,
    createNotification
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
notificationRouter.patch('/:notificationId/read', [
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
 * @route PATCH /notifications/read
 * @returns {Notification[]} 200 - Lista de notificaciones marcadas como leídas
 */
notificationRouter.patch('/read', markAllAsRead);

/**
 * Ruta para eliminar una notificación
 * @route DELETE /notification/:id
 * @param id id de la notificación
 * @returns {Notification} 200 - Notificación eliminada
 * @returns {Error}  400 - Error de validación
 */
notificationRouter.delete('/delete/:notificationId', [
    param('notificationId').notEmpty().withMessage('Notification ID is required'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], deleteNotification);

/**
 * Ruta para eliminar todas las notificaciones
 * @route DELETE /notifications
 * @param username del usuario
 * @returns {Notification[]} 200 - Lista de notificaciones eliminadas
 */
notificationRouter.delete('delete-all/:username', [
    param('username').notEmpty().withMessage('Username is required'),
    param('username').isString().withMessage('Username must be a string'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], deleteAllNotifications);

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

/**
 * Ruta para crear una notificación
 * @route POST /notifications
 * @param username del usuario
 * @param type tipo de notificación
 * @param message mensaje de la notificación
 * @param importance importancia de la notificación
 * @param realTime true si la notificación se envía en tiempo real
 * @returns {Notification} 200 - Notificación creada
 * @returns {Error}  400 - Error de validación
 */
notificationRouter.post('/create', [
    check('username').notEmpty().withMessage('Username is required'),
    check('type').notEmpty().withMessage('Type is required'),
    check('message').notEmpty().withMessage('Message is required'),
    check('importance').notEmpty().withMessage('Importance is required'),
    check('realTime').notEmpty().withMessage('RealTime is required'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], createNotification);



export default notificationRouter;