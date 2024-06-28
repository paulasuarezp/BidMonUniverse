import { Bid } from "../shared/sharedTypes";

const apiEndPointBase = `${process.env.REACT_APP_API_URI}/bids` || 'http://localhost:5001/bids'; // Base URL for the Auction API endpoints


/**
 * Obtiene una puja por su ID.
 * 
 * @param {string} id - ID de la puja
 * 
 * @returns {Promise<Bid>} - Promesa con la puja
 * 
 * @throws {Error} - Error al obtener la puja
 */
export const getBidById = async (id: string): Promise<Bid> => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        throw new Error('No se ha encontrado un token de usuario válido, por favor, vuelva a iniciar sesión');
    }

    const url = `${apiEndPointBase}/b/${id}`;

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener la puja');
            }

            return response.json();
        })
        .catch(error => {
            throw new Error(error);
        });
}


/**
 * Obtiene las pujas activas, que pertenecen al usuario.
 * 
 * @param {string} username - Nombre de usuario
 * 
 * @returns {Promise<Bid[]>} - Promesa con las pujas activas
 * 
 * @throws {Error} - Error al obtener las pujas
 */
export const getUserActiveBids = async (username: string): Promise<Bid[]> => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        throw new Error('No se ha encontrado un token de usuario válido, por favor, vuelva a iniciar sesión');
    }


    const url = `${apiEndPointBase}/active/u/${username.toLowerCase()}`;

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las pujas activas');
            }

            return response.json();
        })
        .catch(error => {
            throw new Error(error);
        });
}


/**
 * Crear una nueva puja
 * @param {string} username - Nombre de usuario
 * @param {string} userCardId - ID de la carta del usuario
 * @param  {number} amount - Precio de la puja
 *  
 * @returns {Promise<Bid>} - Promesa con la subasta creada
 * 
 * @throws {Error} - Error al crear la subasta
 */
export const addBid = async (username: string, auctionId: string, amount: number): Promise<Bid> => {
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
        body: JSON.stringify({ username, auctionId, amount }),
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
 * Retirar una puja para una carta.
 * @param {string} username - Nombre de usuario
 * @param  {string} bidId - ID de la puja
 *  
 * @returns {Promise<Bid>} - Promesa con la puja retirada
 * 
 * @throws {Error} - Error al retirar la puja
 */
export const withdrawBid = async (username: string, bidId: string) => {
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
        body: JSON.stringify({ username, bidId }),
    }).then(response => {
        if (!response.ok) {
            throw new Error('Error al retirar la puja');
        }
        console.log('Response', response);

        return response.json();
    })
        .catch(error => {
            throw new Error(error);
        });

}