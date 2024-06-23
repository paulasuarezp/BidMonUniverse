import * as dotenv from 'dotenv';
import paypal from 'paypal-rest-sdk';

dotenv.config();

paypal.configure({
    'mode': 'sandbox', // Cambiar a 'live' para producción
    'client_id': process.env.PAYPAL_CLIENT_ID,
    'client_secret': process.env.PAYPAL_CLIENT_SECRET
});

export default paypal;
