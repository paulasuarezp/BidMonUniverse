const apiEndPointBase = 'http://localhost:5001/usercards'; // Base URL for the User API endpoints


export const getUserCards = async (username: string) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        return { error: 'No se ha encontrado un token de usuario válido, por favor, vuelva a iniciar sesión' };
    }

    const url = `${apiEndPointBase}/${username.toLowerCase()}`

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                return { error: 'No se han podido obtener las cartas de su colección, inténtelo de nuevo más tarde' };
            }

            return response.json();
        })
        .catch(error => {
            console.error('Ha ocurrido un error al obtener las cartas de su colección:', error.message);
            return { error: 'No se han podido obtener las cartas de su colección, inténtelo de nuevo más tarde' };
        });
};


export const getCardsOfUser = async (username: string) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        return { error: 'No se ha encontrado un token de usuario válido, por favor, vuelva a iniciar sesión' };
    }

    const url = `${apiEndPointBase}/${username.toLowerCase()}/cards`

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                return { error: 'No se han podido obtener las cartas de su colección, inténtelo de nuevo más tarde' };
            }

            return response.json();
        })
        .catch(error => {
            console.error('Ha ocurrido un error al obtener las cartas de su colección:', error.message);
            return { error: 'No se han podido obtener las cartas de su colección, inténtelo de nuevo más tarde' };
        });
};

export const getUserCard = async (username: string, cardId: string) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        return { error: 'No se ha encontrado un token de usuario válido, por favor, vuelva a iniciar sesión' };
    }

    const url = `${apiEndPointBase}/${username.toLowerCase()}/${cardId}`

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                return { error: 'No se ha podido obtener la carta, inténtelo de nuevo más tarde' };
            }

            return response.json();
        })
        .catch(error => {
            console.error('Ha ocurrido un error al obtener la carta:', error.message);
            return { error: 'No se ha podido obtener la carta, inténtelo de nuevo más tarde' };
        });
}

