import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const base = "https://api-m.sandbox.paypal.com";

// Middleware para verificar las credenciales de PayPal
export const generateAccessToken = async () => {
    try {
        if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
            throw new Error("MISSING_API_CREDENTIALS");
        }

        const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
        const response = await fetch(`${base}/v1/oauth2/token`, {
            method: "POST",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Failed to generate Access Token: ${response.statusText} - ${errorBody}`);
        }

        const data = await response.json();
        if (data.access_token) {
            return data.access_token;
        } else {
            throw new Error("Failed to generate Access Token: No access token in response");
        }
    } catch (error) {
        console.error("Failed to generate Access Token:", error);
        throw error;
    }
};

// Función para manejar la respuesta de PayPal
const handleResponse = async (response: any) => {
    try {
        const jsonResponse = await response.json();
        if (!response.ok) {
            console.error("PayPal API error details:", jsonResponse);
            throw new Error(`PayPal API error: ${jsonResponse.message || 'Unknown error'}`);
        }
        return {
            jsonResponse,
            httpStatusCode: response.status,
        };
    } catch (err) {
        console.error("Failed to parse response:", err);
        throw new Error(`Failed to parse response: ${err.message}`);
    }
};

export const createOrder = async (username: string, balance: number, total: number) => {
    try {
        const accessToken = await generateAccessToken();
        const url = `${base}/v2/checkout/orders`;

        const payload = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "EUR",
                        value: total.toString(),
                    },
                    description: `Recarga de saldo para el usuario ${username}, zens comprados: ${balance}. Total: ${total}€`
                },
            ],
        };

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            method: "POST",
            body: JSON.stringify(payload),
        });

        return handleResponse(response);
    } catch (error) {
        console.error("Failed to create order:", error);
        throw new Error(`Failed to create order: ${error.message}`);
    }
};

// Capturar una orden de PayPal
export const captureOrder = async (orderID: string) => {
    try {
        const accessToken = await generateAccessToken();
        const url = `${base}/v2/checkout/orders/${orderID}/capture`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return handleResponse(response);
    } catch (error) {
        console.error("Failed to capture order:", error);
        throw new Error(`Failed to capture order: ${error.message}`);
    }
};
