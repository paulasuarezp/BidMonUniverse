const apiEndPointBase = `${process.env.REACT_APP_API_URI}/cards` || 'http://localhost:5001/api/cards'; // Base URL for the Card API endpoints

/**
 * Obtiene las cartas del usuario desde el servidor utilizando una API.
 * La función primero verifica si existe un token de autenticación almacenado localmente.
 * Si el token no está presente, retorna un error solicitando al usuario que inicie sesión nuevamente.
 * Si existe un token, realiza una solicitud GET a la API para obtener las cartas del usuario.
 * 
 * @param {string} cardId - El ID de la carta que se obtendrá. 
 * 
 * @returns {Promise<Object>} Un objeto que contiene la carta del usuario o un mensaje de error.
 * 
 * @throws {Error} Si no se encuentra un token de usuario válido.
 * @throws {Error} Si no se puede obtener la carta del usuario.
 */
export const getCard = async (cardId: string) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        throw new Error('No se ha encontrado un token de usuario válido, por favor, vuelva a iniciar sesión');
    }

    const url = `${apiEndPointBase}/${cardId}`

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se ha podido obtener la carta, inténtelo de nuevo más tarde');
            }

            return response.json();
        }).catch(error => {
            throw new Error('No se ha podido obtener la carta, inténtelo de nuevo más tarde');
        });
};