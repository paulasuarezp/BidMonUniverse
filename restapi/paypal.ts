import * as dotenv from 'dotenv';
import paypal from 'paypal-rest-sdk';

dotenv.config();

paypal.configure({
    'mode': 'sandbox', // Cambiar a 'live' para producción
    'client_id': "AXE7-9Er_F_oY9-RdBsCvSZQ1OBfeTbgUVzzTj1tZk9RivJRYoI5U-xNYqUgqwY0z3_M4NvC6hJ5Cg8_",
    'client_secret': process.env.PAYPAL_CLIENT_SECRET
});

export default paypal;
