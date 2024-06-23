// controllers/paypalController.ts
import { Request, Response } from 'express';
import paypal from '../../paypal';
import User from '../models/user';

export const createOrder = (req: Request, res: Response): void => {
    const { username, total, balance } = req.body;

    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": `http://localhost:3000/api/paypal/success?username=${username}&total=${total}&balance=${balance}`,
            "cancel_url": "http://localhost:3000/api/paypal/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": `Recarga de saldo para el usuario ${username}, zens comprados: ${balance}. Total: ${total}€`,
                    "sku": "001",
                    "price": total,
                    "currency": "EUR",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "EUR",
                "total": total
            },
            "description": `Recarga de saldo para el usuario ${username}, zens comprados: ${balance}. Total: ${total}€`,
        }]
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.json({ approval_url: payment.links[i].href });
                }
            }
        }
    });
};

export const handleSuccess = async (req: Request, res: Response): Promise<any> => {
    const payerId = req.query.PayerID as string;
    const paymentId = req.query.paymentId as string;
    const total = req.query.total as string;
    const username = req.query.username as string;
    const balance = parseInt(req.query.balance as string);

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "EUR",
                "total": total
            }
        }]
    };

    try {
        const payment = await new Promise<any>((resolve, reject) => {
            paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
                if (error) {
                    return reject(error);
                }
                resolve(payment);
            });
        });

        const user = await User.findOne({ username_lower: username.toLowerCase() });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        user.balance += balance;
        await user.save();

        res.send('Pago completado con éxito y saldo actualizado.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al procesar el pago.');
    }
};



export const completeOrder = async (req: Request, res: Response): Promise<any> => {
    const { orderID, username, balance, total } = req.body;

    const execute_payment_json = {
        "payer_id": orderID,
        "transactions": [{
            "amount": {
                "currency": "EUR",
                "total": total
            }
        }]
    };

    try {
        const payment = await new Promise<any>((resolve, reject) => {
            paypal.payment.execute(orderID, execute_payment_json, (error, payment) => {
                if (error) {
                    return reject(error);
                }
                resolve(payment);
            });
        });

        const user = await User.findOne({ username_lower: username.toLowerCase() });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        user.balance += balance;
        await user.save();

        res.json({ message: 'Pago completado con éxito y saldo actualizado.' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al procesar el pago.');
    }
};