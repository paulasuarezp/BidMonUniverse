const apiEndPointBase = 'http://localhost:5001/purchases'; // Base URL for the Card API endpoints

/**
 * Realiza la compra de un sobre de cartas
 * @param {string} username - Nombre de usuario
 * @param {string} cardPackId - ID del sobre de cartas del usuario
 *  
 * @returns {Promise<Auction>} - Promesa con las cartas que se han obtenido
 * 
 * @throws {Error} - Error al comprar el sobre de cartas
 */
export const purchaseCardPack = async (username: string, cardPackId: string) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        throw new Error('No se ha encontrado un token de usuario válido, por favor, vuelva a iniciar sesión');
    }

    username = username.toLowerCase();

    const url = `${apiEndPointBase}/cardpack`

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username, cardPackId }),
    }).then(response => {
        if (!response.ok) {
            throw new Error(' No se ha podido comprar el sobre de cartas. Por favor, inténtalo de nuevo.');
        }
        console.log('Response', response);

        return response.json();
    })
        .catch(error => {
            throw new Error(error);
        });

}
