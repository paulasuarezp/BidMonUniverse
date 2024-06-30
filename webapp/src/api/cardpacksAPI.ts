const apiEndPointBase = process.env.REACT_APP_API_URI ? `${process.env.REACT_APP_API_URI}/cardpacks` : 'http://localhost:5001/api/cardpacks'; // Base URL for the User API endpoints

/**
 * Obtiene los sobres de cartas disponibles para su compra desde el servidor utilizando una API.
 * La función primero verifica si existe un token de autenticación almacenado localmente.
 * Si el token no está presente, retorna un error solicitando al usuario que inicie sesión nuevamente.
 * Si existe un token, realiza una solicitud GET a la API para obtener los sobres de cartas.
 * 
 * 
 * @returns {Promise<Object>} Un objeto que contiene los sobres de cartas disponibles o un mensaje de error.
 * 
 * @throws {Error} Si no se encuentra un token de usuario válido.
 * @throws {Error} Si no se puede obtener los sobres de cartas.
 */
export const getCardPacks = async () => {
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
                throw new Error('No se ha podido obtener los sobres de cartas, inténtelo de nuevo más tarde');
            }

            return response.json();
        }).catch(error => {
            throw new Error('No se ha podido obtener los sobres de cartas, inténtelo de nuevo más tarde');
        });
};

