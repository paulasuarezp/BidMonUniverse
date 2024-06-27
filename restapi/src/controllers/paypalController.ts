import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const base = "https://api-m.sandbox.paypal.com";

/**
 * Función para generar un token de acceso a la API de PayPal
 * @returns {string} - Access token
 * @throws {Error} - Si no se pueden generar las credenciales de la API
 */
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
        throw error;
    }
};

/**
 * Función para manejar la respuesta de la API de PayPal
 * @param response - Respuesta de la API de PayPal
 * @returns {jsonResponse, httpStatusCode} - JSON de respuesta y código de estado HTTP
 */
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

/**
 * Función para crear una orden de PayPal
 * @param username - Nombre de usuario
 * @param balance - Saldo a añadir
 * @param total - Total a pagar
 * @returns {jsonResponse, httpStatusCode} - JSON de respuesta y código de estado HTTP
 * @throws {Error} - Si no se puede crear la orden
 */
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