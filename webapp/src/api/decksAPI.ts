const apiEndPointBase = 'http://localhost:5001/decks'; // Base URL for the Card API endpoints

/**
 * Obtiene los mazos de cartas disponibles para su compra desde el servidor utilizando una API.
 * La función primero verifica si existe un token de autenticación almacenado localmente.
 * Si el token no está presente, retorna un error solicitando al usuario que inicie sesión nuevamente.
 * Si existe un token, realiza una solicitud GET a la API para obtener los mazos de cartas.
 * 
 * 
 * @returns {Promise<Object>} Un objeto que contiene los mazos de cartas disponibles o un mensaje de error.
 * 
 * @throws {Error} Si no se encuentra un token de usuario válido.
 * @throws {Error} Si no se puede obtener los mazos de cartas.
 */
export const getDecks = async () => {
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
                throw new Error('No se ha podido obtener los mazos de cartas, inténtelo de nuevo más tarde');
            }

            return response.json();
        }).catch(error => {
            throw new Error('No se ha podido obtener los mazos de cartas, inténtelo de nuevo más tarde');
        });
};

/**
 * Obtiene un mazo de cartas por su Deck ID desde el servidor utilizando una API.
 * La función primero verifica si existe un token de autenticación almacenado localmente.
 * Si el token no está presente, retorna un error solicitando al usuario que inicie sesión nuevamente.
 * Si existe un token, realiza una solicitud GET a la API para obtener el mazo de cartas.
 * 
 * @param {string} deckId - El DeckID del mazo de cartas que se desea obtener.
 * 
 * @returns {Promise<Object>} Un objeto que contiene el mazo de cartas solicitado o un mensaje de error.
 * 
 * @throws {Error} Si no se encuentra un token de usuario válido.
 * @throws {Error} Si no se puede obtener el mazo de cartas.
 */
export const getDeckById = async (deckId: string) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        throw new Error('No se ha encontrado un token de usuario válido, por favor, vuelva a iniciar sesión');
    }

    const url = `${apiEndPointBase}/${deckId}`

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se ha podido obtener el mazo de cartas, inténtelo de nuevo más tarde');
            }

            return response.json();
        }).catch(error => {
            throw new Error('No se ha podido obtener el mazo de cartas, inténtelo de nuevo más tarde');
        });
};
