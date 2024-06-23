import express, { Request, Response, Router } from 'express';
import { check, validationResult } from 'express-validator';
import { captureOrder, createOrder } from '../controllers/paypalController';
import User from '../models/user';

const paypalRouter: Router = express.Router();

// Middleware de validación para crear una orden
const validateCreateOrder = [
    check('username').notEmpty().withMessage('Username is required'),
    check('balance').isNumeric().withMessage('Balance must be a number'),
    check('total').isNumeric().withMessage('Total must be a number')
];

// Ruta para crear una orden
paypalRouter.post("/orders", validateCreateOrder, async (req: Request, res: Response) => {
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

// Ruta para capturar una orden
paypalRouter.post("/orders/:orderID/capture", async (req: Request, res: Response) => {
    const { orderID } = req.params;
    const { username, balance } = req.body;

    try {
        const { jsonResponse, httpStatusCode } = await captureOrder(orderID);

        if (httpStatusCode === 201) {
            // Actualiza el saldo del usuario
            const user = await User.findOne({ username_lower: username.toLowerCase() });
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            user.balance += balance;
            await user.save();

            res.json({ message: 'Pago completado con éxito y saldo actualizado.', user });
        } else {
            res.status(httpStatusCode).json(jsonResponse);
        }
    } catch (error) {
        console.error("Failed to capture order:", error);
        res.status(500).json({ error: "Failed to capture order." });
    }
});

export default paypalRouter;
