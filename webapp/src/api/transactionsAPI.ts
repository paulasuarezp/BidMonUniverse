const apiEndPointBase = `${process.env.REACT_APP_API_URI}/transactions` || 'http://localhost:5001/api/transactions'; // Base URL for the Transaction API endpoints

/**
 * Obtiene las transacciones de la carta del usuario desde el servidor utilizando una API.
 * 
 * @param {string} userCardId - El ID de la carta del usuario para la que se obtendrán las transacciones. 
 * @returns {Promise<Object>} Un objeto que contiene las transacciones de la carta del usuario o un mensaje de error.
 * 
 * @throws {Error} Si no se encuentra un token de usuario válido.
 */

export const getTransactionsForUserCard = async (userCardId: string) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        throw new Error('No se ha encontrado un token de usuario válido, por favor, vuelva a iniciar sesión');
    }

    const url = `${apiEndPointBase}/c/${userCardId}`

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se han podido obtener las transacciones de la carta, inténtelo de nuevo más tarde');
            }

            return response.json();
        })
        .catch(error => {
            throw new Error('No se han podido obtener las transacciones de la carta, inténtelo de nuevo más tarde');
        });
}

/**
 * Obtiene las transacciones de un usuario usuario desde el servidor utilizando una API.
 * 
 * @param {string} username - El nombre de usuario para el que se obtendrán las transacciones.
 * @returns {Promise<Object>} Un objeto que contiene las transacciones del usuario o un mensaje de error.
 * 
 * @throws {Error} Si no se encuentra un token de usuario válido.
 */
export const getTransactionsForUser = async (username: string) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        throw new Error('No se ha encontrado un token de usuario válido, por favor, vuelva a iniciar sesión');
    }

    const url = `${apiEndPointBase}/u/${username.toLowerCase()}`

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se han podido obtener las transacciones del usuario, inténtelo de nuevo más tarde');
            }

            return response.json();
        })
        .catch(error => {
            throw new Error('No se han podido obtener las transacciones del usuario, inténtelo de nuevo más tarde');
        });
}

/**
 * Obtiene las transacciones realizadas por todos los usuarios desde el servidor utilizando una API.
 * 
 * @returns {Promise<Object>} Un objeto que contiene las transacciones del usuario o un mensaje de error.
 * 
 * @throws {Error} Si no se encuentra un token de usuario válido.
 */
export const getAllTransactions = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        throw new Error('No se ha encontrado un token de usuario válido, por favor, vuelva a iniciar sesión');
    }

    const url = `${apiEndPointBase}/`

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se han podido obtener las transacciones de la aplicación, inténtelo de nuevo más tarde');
            }

            return response.json();
        })
        .catch(error => {
            throw new Error('No se han podido obtener las transacciones transacciones de la aplicación, inténtelo de nuevo más tarde');
        });
}

