import express, { Request, Response, Router } from 'express';
import { check, validationResult } from 'express-validator';
import { completeOrder, createOrder, handleSuccess } from '../controllers/paypalController';
import auth from '../middlewares/authMiddleware';

const paypalRouter: Router = express.Router();

paypalRouter.use(auth);

/**
 * Ruta para crear una orden de pago
 * @route POST /paypal/order
 */
paypalRouter.post('/order', [
    check('username').notEmpty().withMessage('Username is required'),
    check('total').notEmpty().withMessage('Total is required'),
    check('balance').notEmpty().withMessage('Balance is required'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], createOrder);

/**
 * Ruta para manejar la respuesta de éxito de PayPal
 * @route GET /paypal/success
 */
paypalRouter.get('/success', handleSuccess);

/**
 * Ruta para completar el pago
 * @route POST /paypal/complete
 */
paypalRouter.post('/complete', completeOrder);

paypalRouter.get('/cancel', (req: Request, res: Response) => res.send('Pago cancelado.'));

export default paypalRouter;
