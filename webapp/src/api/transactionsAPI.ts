const apiEndPointBase = 'http://localhost:5001/transactions'; // Base URL for the Transaction API endpoints

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

