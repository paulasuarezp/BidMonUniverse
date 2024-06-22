import { Auction } from "../shared/sharedTypes";

const apiEndPointBase = 'http://localhost:5001/auctions'; // Base URL for the Auction API endpoints

/**
 * Crear una nueva subasta para una carta.
 * @param {string} username - Nombre de usuario
 * @param {string} userCardId - ID de la carta del usuario
 * @param  {number} saleBase - Precio base de la subasta
 * @param {number} duration - Duración de la subasta en minutos
 *  
 * @returns {Promise<Auction>} - Promesa con la subasta creada
 * 
 * @throws {Error} - Error al crear la subasta
 */
export const addAuction = async (username: string, userCardId: string, saleBase: number, duration: number) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        throw new Error('No token found');
    }

    const url = `${apiEndPointBase}/add`

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username, userCardId, saleBase, duration }),
    }).then(response => {
        if (!response.ok) {
            throw new Error('Error al crear la subasta');
        }
        console.log('Response', response);

        return response.json();
    })
        .catch(error => {
            throw new Error(error);
        });

}


/**
 * Retirar una subasta para una carta.
 * @param {string} username - Nombre de usuario
 * @param  {string} auctionId - ID de la subasta
 *  
 * @returns {Promise<Auction>} - Promesa con la subasta retirada
 * 
 * @throws {Error} - Error al retirar la subasta
 */
export const withdrawAuction = async (username: string, auctionId: string) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        throw new Error('No token found');
    }

    const url = `${apiEndPointBase}/withdraw`

    return fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username, auctionId }),
    }).then(response => {
        if (!response.ok) {
            throw new Error('Error al retirar la subasta');
        }
        console.log('Response', response);

        return response.json();
    })
        .catch(error => {
            throw new Error(error);
        });

}



/**
 * Obtiene las subastas activas, que no pertenecen al usuario.
 * 
 * @param {string} username - Nombre de usuario
 * 
 * @returns {Promise<Auction[]>} - Promesa con las subastas activas
 * 
 * @throws {Error} - Error al obtener las subastas
 */
export const getActiveAuctions = async (username: string): Promise<any[]> => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        throw new Error('No se ha encontrado un token de usuario válido, por favor, vuelva a iniciar sesión');
    }

    const url = `${apiEndPointBase}/active/${username}`;

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las subastas activas');
            }

            return response.json();
        })
        .catch(error => {
            throw new Error(error);
        });
}


/**
 * Obtiene las subastas activas, que pertenecen al usuario.
 * 
 * @param {string} username - Nombre de usuario
 * 
 * @returns {Promise<Auction[]>} - Promesa con las subastas activas
 * 
 * @throws {Error} - Error al obtener las subastas
 */
export const getUserActiveAuctions = async (username: string): Promise<any[]> => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        throw new Error('No se ha encontrado un token de usuario válido, por favor, vuelva a iniciar sesión');
    }

    const url = `${apiEndPointBase}/active/u/${username}`;

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las subastas activas');
            }

            return response.json();
        })
        .catch(error => {
            throw new Error(error);
        });
}

/**
 * Obtiene la subasta cuyo id se pasa como parámetro.
 * 
 * @param {string} username - Nombre de usuario
 * 
 * @returns {Promise<Auction[]>} - Promesa con las subastas activas
 * 
 * @throws {Error} - Error al obtener las subastas
 */
export const getAuction = async (id: string): Promise<Auction> => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        throw new Error('No se ha encontrado un token de usuario válido, por favor, vuelva a iniciar sesión');
    }

    const url = `${apiEndPointBase}/a/${id}`;

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las subastas activas');
            }

            return response.json();
        })
        .catch(error => {
            throw new Error(error);
        });
}


