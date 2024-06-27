import express, { Request, Response, Router } from 'express';
import { check, validationResult } from 'express-validator';
import { createOrder } from '../controllers/paypalController';
import User from '../models/user';

const paypalRouter: Router = express.Router();

/**
 * Ruta para crear una orden de PayPal.
 * @route POST /orders
 * @param username - Nombre de usuario
 * @param balance - Saldo a añadir
 * @param total - Total a pagar
 * @returns {Message} 200 - Orden creada con éxito
 * @returns {Error} 400 - Error de validación
 * @returns {Error} 500 - Error al crear la orden
 */
paypalRouter.post("/orders", [
    check('username').notEmpty().withMessage('Username is required'),
    check('balance').notEmpty().withMessage('Balance is required'),
    check('total').notEmpty().withMessage('Total is required')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, balance, total } = req.body;

    try {
        const { jsonResponse, httpStatusCode } = await createOrder(username, balance, total);
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to create order." });
    }
});

/**
 * Ruta para actualizar el saldo de un usuario después de completar un pago.
 * @route POST /updateorder
 * @param username - Nombre de usuario
 * @param balance - Saldo a añadir
 * @returns {Message} 200 - Pago completado con éxito y saldo actualizado
 * @returns {Error} 404 - Usuario no encontrado
 */
paypalRouter.post("/updateorder", async (req: Request, res: Response) => {
    const { username, balance } = req.body;

    try {
        const user = await User.findOne({ username_lower: username.toLowerCase() });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        user.balance += balance;
        await user.save();

        res.json({ message: 'Pago completado con éxito y saldo actualizado.', user });
    } catch (error) {
        console.error("Failed to update user balance:", error);
        res.status(500).json({ error: "Failed to update user balance." });
    }
});

export default paypalRouter;