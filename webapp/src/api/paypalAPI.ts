const apiEndPointBase = 'http://localhost:5001/paypal'; // Base URL for the PayPal API endpoints

/**
 * Realiza una solicitud POST al servidor para procesar un pago a través de PayPal.
 * La función primero verifica si existe un token de autenticación almacenado localmente.
 * Si el token no está presente, retorna un error solicitando al usuario que inicie sesión nuevamente.
 * Si existe un token, realiza una solicitud POST a la API para procesar el pago.
 * 
 * @param {number} total - El total del pago a procesar.
 * @param {string} username - El nombre de usuario para el que se procesa el pago.
 * @param {number} balance - El saldo a recargar en la cuenta del usuario.
 * 
 * @returns {Promise<void>} Una promesa que resuelve cuando la URL de aprobación de PayPal ha sido obtenida y el usuario es redirigido.
 * 
 */
export const handlePay = async (orderID: string, total: number, username: string, balance: number): Promise<void> => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        throw new Error('No se ha encontrado un token de usuario válido, por favor, vuelva a iniciar sesión');
    }

    const url = `${apiEndPointBase}/complete`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ orderID, total, username, balance }),
        });

        if (!response.ok) {
            throw new Error('No se ha podido obtener la URL de aprobación de PayPal, inténtelo de nuevo más tarde');
        }

        const data = await response.json(); // Convertir la respuesta a JSON
        const { approval_url } = data;

        if (approval_url) {
            window.location.href = approval_url; // Redirigir al usuario a la URL de aprobación de PayPal
        } else {
            throw new Error('No se ha recibido la URL de aprobación de PayPal');
        }
    } catch (error) {
        throw new Error(error.message || 'No se ha podido obtener la URL de aprobación de PayPal, inténtelo de nuevo más tarde');
    }
};
